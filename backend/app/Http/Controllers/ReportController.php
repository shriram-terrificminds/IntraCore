<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\InventoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    /**
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function index(Request $request)
    {
        // Filters
        $type = $request->input('type', 'all'); // inventory, complaints, all
        $roleFilter = $request->input('role');
        $locationFilter = $request->input('location');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $perPage = $request->input('per_page', 20);
        $page = $request->input('page', 1);

        $results = collect();

        $dateFrom = $dateFrom ? Carbon::parse($dateFrom)->startOfDay() : null;
        $dateTo = $dateTo ? Carbon::parse($dateTo)->endOfDay() : null;

        // Map frontend location names to backend names/IDs
        $locationMap = [
            'tvm' => 'Trivandrum',
            'trivandrum' => 'Trivandrum',
            'ernakulam' => 'Kochi',
            'kochi' => 'Kochi',
            'perth' => 'Perth',
            'bangalore' => 'Bangalore',
        ];
        $locationFilterValue = null;
        if ($locationFilter) {
            $key = strtolower($locationFilter);
            $locationFilterValue = $locationMap[$key] ?? $locationFilter;
        }

        // Complaints
        if ($type === 'complaints' || $type === 'all') {
            $complaints = Complaint::with(['user.location', 'role'])
                ->when($roleFilter, fn($q) => $q->whereHas('role', fn($qr) => $qr->where('name', $roleFilter)))
                ->when($locationFilterValue, fn($q) => $q->whereHas('user.location', function ($qu) use ($locationFilterValue) {
                    $qu->whereRaw('LOWER(name) = ?', [strtolower($locationFilterValue)])
                       ->orWhereRaw('LOWER(name) = ?', [strtolower(array_search($locationFilterValue, [
                           'Trivandrum' => 'TVM',
                           'Kochi' => 'Ernakulam',
                           'Perth' => 'Perth',
                           'Bangalore' => 'Bangalore',
                       ]) ?: $locationFilterValue)]);
                }))
                ->when($dateFrom && $dateTo, fn($q) => $q->whereBetween('created_at', [$dateFrom, $dateTo]))
                ->select(['id', 'complaint_number as number', 'title', 'resolution_status as status', 'role_id', 'user_id', 'created_at', 'resolution_notes'])
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'Complaint',
                        'number' => $item->number,
                        'title' => $item->title,
                        'status' => $item->status,
                        'role' => $item->role?->name,
                        'user' => $item->user?->first_name . ' ' . $item->user?->last_name,
                        'location' => $item->user?->location?->name,
                        'date' => $item->created_at->format('Y-m-d'),
                        'resolution_note' => $item->resolution_notes,
                    ];
                });
            $results = $results->concat($complaints);
        }

        // Inventory Requests
        if ($type === 'inventory' || $type === 'all') {
            $requests = InventoryRequest::with(['user.location', 'role'])
                ->when($roleFilter, fn($q) => $q->whereHas('role', fn($qr) => $qr->where('name', $roleFilter)))
                ->when($locationFilterValue, fn($q) => $q->whereHas('user.location', function ($qu) use ($locationFilterValue) {
                    $qu->whereRaw('LOWER(name) = ?', [strtolower($locationFilterValue)])
                       ->orWhereRaw('LOWER(name) = ?', [strtolower(array_search($locationFilterValue, [
                           'Trivandrum' => 'TVM',
                           'Kochi' => 'Ernakulam',
                           'Perth' => 'Perth',
                           'Bangalore' => 'Bangalore',
                       ]) ?: $locationFilterValue)]);
                }))
                ->when($dateFrom && $dateTo, fn($q) => $q->whereBetween('created_at', [$dateFrom, $dateTo]))
                ->select(['id', 'request_number as number', 'title', 'status', 'role_id', 'user_id', 'created_at'])
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => 'Inventory',
                        'number' => $item->number,
                        'title' => $item->title,
                        'status' => $item->status,
                        'role' => $item->role?->name,
                        'user' => $item->user?->first_name . ' ' . $item->user?->last_name,
                        'location' => $item->user?->location?->name,
                        'date' => $item->created_at->format('Y-m-d'),
                        'resolution_note' => null,
                    ];
                });
            $results = $results->concat($requests);
        }

        // Sort by date desc
        $results = $results->sortByDesc('date')->values();
        $total = $results->count();
        $paginated = $results->forPage($page, $perPage)->values();

        return response()->json([
            'data' => $paginated,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
        ]);
    }

    public function locations()
    {
        // Get all unique location names from users in complaints and inventory requests
        $locationNames = collect();
        $complaintLocations = \App\Models\Complaint::with('user.location')->get()->pluck('user.location.name')->filter();
        $requestLocations = \App\Models\InventoryRequest::with('user.location')->get()->pluck('user.location.name')->filter();
        $locationNames = $locationNames->concat($complaintLocations)->concat($requestLocations)->unique()->values();

        // Map backend names to display names
        $displayMap = [
            'TVM' => 'Trivandrum',
            'Trivandrum' => 'Trivandrum',
            'Ernakulam' => 'Kochi',
            'Kochi' => 'Kochi',
            'Perth' => 'Perth',
            'Bangalore' => 'Bangalore',
        ];
        $displayNames = $locationNames->map(fn($name) => $displayMap[$name] ?? $name)->unique()->values();
        return response()->json(['locations' => $displayNames]);
    }
}
