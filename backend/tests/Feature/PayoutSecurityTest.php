<?php

namespace Tests\Feature;

use App\Models\LedgerEntry;
use App\Models\PayoutRequest;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PayoutSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $organizer;
    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Payout Test Tenant',
            'slug' => 'payout-test-tenant',
            'status' => 'active',
        ]);

        $this->organizer = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'role' => 'trusted_organizer',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $this->admin = User::factory()->create(['role' => 'super_admin']);

        // Give organizer $500 in wallet balance via ledger credit
        LedgerEntry::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenant->id,
            'type' => 'ticket_sale',
            'direction' => 'credit',
            'amount' => 500.00,
            'currency' => 'USD',
            'account_type' => 'organizer_wallet',
            'description' => 'Initial test credit',
        ]);
    }

    public function test_payout_request_fails_if_exceeding_balance()
    {
        $response = $this->actingAs($this->organizer, 'sanctum')
            ->postJson('/api/v1/workspace/payouts/request', [
                'amount' => 600.00, // Exceeds $500 balance
                'bank_name' => 'Access Bank',
                'account_number' => '0123456789',
                'account_name' => 'Test Organizer',
            ]);

        $response->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_pending_payouts_deduct_from_available_balance()
    {
        // First payout request for $400 succeeds ($100 remaining)
        $firstResponse = $this->actingAs($this->organizer, 'sanctum')
            ->postJson('/api/v1/workspace/payouts/request', [
                'amount' => 400.00,
                'bank_name' => 'Access Bank',
                'account_number' => '0123456789',
                'account_name' => 'Test Organizer',
            ]);

        $firstResponse->assertStatus(201);

        // Second payout request for $200 fails because available balance is now $100 ($500 - $400 pending)
        $secondResponse = $this->actingAs($this->organizer, 'sanctum')
            ->postJson('/api/v1/workspace/payouts/request', [
                'amount' => 200.00,
                'bank_name' => 'Access Bank',
                'account_number' => '0123456789',
                'account_name' => 'Test Organizer',
            ]);

        $secondResponse->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_disburse_payout_creates_debit_ledger_entry()
    {
        $payout = PayoutRequest::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->organizer->id,
            'amount' => 300.00,
            'currency' => 'USD',
            'bank_name' => 'GTBank',
            'account_number' => '0987654321',
            'account_name' => 'Test Organizer',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/payouts/{$payout->id}/disburse");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('completed', $payout->fresh()->status);

        // Verify debit ledger entry created
        $this->assertDatabaseHas('ledger_entries', [
            'tenant_id' => $this->tenant->id,
            'type' => 'payout_disbursed',
            'direction' => 'debit',
            'amount' => 300.00,
            'account_type' => 'organizer_wallet',
        ]);
    }
}
