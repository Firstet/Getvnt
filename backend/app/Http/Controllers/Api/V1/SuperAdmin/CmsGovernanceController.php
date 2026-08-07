<?php

namespace App\Http\Controllers\Api\V1\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Models\CmsSection;
use Illuminate\Http\Request;

class CmsGovernanceController extends Controller
{
    /**
     * GET /api/v1/cms/landing
     * Public & Admin — Get landing page CMS sections.
     */
    public function getLandingSections()
    {
        CmsSection::seedDefaults();
        $sections = CmsSection::where('page_slug', 'landing')
            ->orderBy('order_index', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $sections,
        ]);
    }

    /**
     * PUT /api/v1/admin/cms/sections/{id}
     * Super Admin — Update a specific CMS section.
     */
    public function updateLandingSection(Request $request, $id)
    {
        $section = CmsSection::findOrFail($id);

        $validated = $request->validate([
            'title'        => 'sometimes|string',
            'subtitle'     => 'sometimes|nullable|string',
            'is_visible'   => 'sometimes|boolean',
            'order_index'  => 'sometimes|integer',
            'content_json' => 'sometimes|nullable|array',
        ]);

        $section->update($validated);

        return response()->json([
            'success' => true,
            'message' => "Section '{$section->section_key}' updated successfully.",
            'data'    => $section->fresh(),
        ]);
    }

    /**
     * POST /api/v1/admin/cms/sections/reorder
     * Super Admin — Reorder sections array.
     */
    public function reorderLandingSections(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|integer',
            'orders.*.order_index' => 'required|integer',
        ]);

        foreach ($request->input('orders') as $item) {
            CmsSection::where('id', $item['id'])->update(['order_index' => $item['order_index']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Landing page sections reordered successfully.',
        ]);
    }

    /**
     * GET /api/v1/cms/pages
     * Get all static CMS pages.
     */
    public function getPages()
    {
        CmsPage::seedDefaults();
        $pages = CmsPage::orderBy('title', 'asc')->get();

        return response()->json([
            'success' => true,
            'data'    => $pages,
        ]);
    }

    /**
     * GET /api/v1/cms/pages/{slug}
     * Get single static CMS page by slug.
     */
    public function getPage($slug)
    {
        CmsPage::seedDefaults();
        $page = CmsPage::where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $page,
        ]);
    }

    /**
     * PUT /api/v1/admin/cms/pages/{slug}
     * Super Admin — Update single static CMS page.
     */
    public function updatePage(Request $request, $slug)
    {
        $page = CmsPage::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'title'            => 'sometimes|string',
            'subtitle'         => 'sometimes|nullable|string',
            'body_markdown'    => 'sometimes|nullable|string',
            'meta_title'       => 'sometimes|nullable|string',
            'meta_description' => 'sometimes|nullable|string',
            'is_published'     => 'sometimes|boolean',
        ]);

        $page->update($validated);

        return response()->json([
            'success' => true,
            'message' => "CMS Page '{$page->title}' updated successfully.",
            'data'    => $page->fresh(),
        ]);
    }
}
