<?php

namespace App\Http\Controllers;

use App\Models\InventoryRequest;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = Auth::user();
        $role = strtolower($user->role->name);
        $data = [];

        $dateFilter = $request->input('date_filter', 'this_month');
        $startDate = null;
        $endDate = null;

        switch ($dateFilter) {
            case 'this_month':
                $startDate = Carbon::now()->startOfMonth();
                $endDate = Carbon::now()->endOfMonth();
                break;
            case 'this_year':
                $startDate = Carbon::now()->startOfYear();
                $endDate = Carbon::now()->endOfYear();
                break;
            case 'all_time':
            default:
                // No date filters needed
                break;
        }

        // Define base queries
        $inventoryRequestQuery = InventoryRequest::query();
        $complaintQuery = Complaint::query();

        // Apply date filters if provided
        if ($startDate && $endDate) {
            $inventoryRequestQuery->whereBetween('created_at', [$startDate, $endDate]);
            $complaintQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        if (in_array($role, ['admin', 'hr', 'devops'])) {
            $data['active_requests'] = (clone $inventoryRequestQuery)->where('status', 'Approved')->count();
            $data['active_complaints'] = (clone $complaintQuery)->where('resolution_status', 'In-progress')->count();
            $data['total_shipped'] = (clone $inventoryRequestQuery)->where('status', 'Shipped')->count();
        } else {
            $data['my_requests'] = (clone $inventoryRequestQuery)->where('user_id', $user->id)->count();
            $data['my_complaints'] = (clone $complaintQuery)->where('user_id', $user->id)->count();
            $data['pending_requests'] = (clone $inventoryRequestQuery)->where('user_id', $user->id)->where('status', 'Approved')->count();
            $data['pending_complaints'] = (clone $complaintQuery)->where('user_id', $user->id)->where('resolution_status', 'In-progress')->count();
        }

        return response()->json($data);
    }
} 