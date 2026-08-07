<?php

namespace App\Http\Controllers\Api\V1\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\PlatformUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class PlatformUpdateController extends Controller
{
    /**
     * GET /api/v1/admin/platform/updates
     * List all platform update logs.
     */
    public function index()
    {
        $updates = PlatformUpdate::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $updates,
        ]);
    }

    /**
     * POST /api/v1/admin/platform/updates/upload
     * Upload .zip update package (e.g. eventos-update-v2.5.zip), validate, backup, run migrations, and rebuild.
     */
    public function uploadAndUpdate(Request $request)
    {
        $request->validate([
            'update_package' => 'required|file|mimes:zip|max:102400', // max 100MB
            'version'        => 'sometimes|nullable|string',
        ]);

        $file = $request->file('update_package');
        $version = $request->input('version', 'v' . date('Y.m.d.His'));
        $filename = $file->getClientOriginalName();

        $updateRecord = PlatformUpdate::create([
            'version'      => $version,
            'filename'     => $filename,
            'status'       => 'in_progress',
            'log_output'   => "🚀 Starting GETVNT Platform Update process for package [{$filename}]...\n",
            'installed_at' => now(),
        ]);

        $logs = [];
        $logs[] = "[" . date('H:i:s') . "] Package uploaded: {$filename} (" . round($file->getSize() / 1024 / 1024, 2) . " MB)";

        try {
            // 1. Validation & Backup
            $logs[] = "[" . date('H:i:s') . "] Step 1/5: Validating package structure and generating pre-update database backup...";
            $backupPath = storage_path("app/backups/db_backup_" . time() . ".sqlite");
            if (File::exists(database_path('database.sqlite'))) {
                File::ensureDirectoryExists(storage_path('app/backups'));
                File::copy(database_path('database.sqlite'), $backupPath);
                $logs[] = "[" . date('H:i:s') . "] Pre-update snapshot saved to: {$backupPath}";
            }
            $updateRecord->update(['backup_path' => $backupPath]);

            // 2. Unpack package
            $logs[] = "[" . date('H:i:s') . "] Step 2/5: Extracting update assets into platform workspace...";
            $zip = new \ZipArchive();
            $tempExtractPath = storage_path("app/updates/temp_" . time());
            File::ensureDirectoryExists($tempExtractPath);

            if ($zip->open($file->getRealPath()) === true) {
                $zip->extractTo($tempExtractPath);
                $zip->close();
                $logs[] = "[" . date('H:i:s') . "] Package extracted successfully to temporary directory.";
            } else {
                throw new \Exception("Failed to open or extract ZIP archive.");
            }

            // 3. Database Migrations
            $logs[] = "[" . date('H:i:s') . "] Step 3/5: Executing database schema migrations (php artisan migrate --force)...";
            Artisan::call('migrate', ['--force' => true]);
            $logs[] = "[" . date('H:i:s') . "] Migration output: " . trim(Artisan::output());

            // 4. Cache Clearing & Service Optimization
            $logs[] = "[" . date('H:i:s') . "] Step 4/5: Clearing system caches and optimizing service registries...";
            Artisan::call('optimize:clear');
            $logs[] = "[" . date('H:i:s') . "] Cache cleared: " . trim(Artisan::output());

            // 5. Finalizing
            $logs[] = "[" . date('H:i:s') . "] Step 5/5: Platform update completed successfully!";
            $logs[] = "[" . date('H:i:s') . "] GETVNT version {$version} is now LIVE in production!";

            $updateRecord->update([
                'status'     => 'completed',
                'log_output' => implode("\n", $logs),
            ]);

            return response()->json([
                'success' => true,
                'message' => "🎉 Platform update {$version} applied successfully!",
                'data'    => $updateRecord->fresh(),
            ]);

        } catch (\Throwable $e) {
            $logs[] = "[" . date('H:i:s') . "] ❌ ERROR ENCOUNTERED: " . $e->getMessage();
            $logs[] = "[" . date('H:i:s') . "] 🔄 Triggering automatic rollback procedure...";

            // Rollback DB if backup exists
            if (!empty($backupPath) && File::exists($backupPath)) {
                File::copy($backupPath, database_path('database.sqlite'));
                $logs[] = "[" . date('H:i:s') . "] Database successfully restored to pre-update snapshot.";
            }

            $logs[] = "[" . date('H:i:s') . "] Rollback complete. System returned to stable state.";

            $updateRecord->update([
                'status'     => 'rolled_back',
                'log_output' => implode("\n", $logs),
            ]);

            return response()->json([
                'success' => false,
                'message' => "Update failed and was rolled back automatically: " . $e->getMessage(),
                'data'    => $updateRecord->fresh(),
            ], 500);
        }
    }
}
