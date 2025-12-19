<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
class LeaveController extends Controller
{
    public function index()
    {
        return Leave::with(['personnel','leaveType'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'personnel_id' => 'required|exists:personnels,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'leave_balance' => 'nullable|integer',
            'status' => 'nullable|in:pending,approved,rejected'
        ]);

        $data['status'] = $data['status'] ?? 'pending';

        return response()->json(
            Leave::create($data)->load(['personnel','leaveType']),
            201
        );
    }

    public function show(Leave $leave)
    {
        return $leave->load(['personnel','leaveType']);
    }

    public function update(Request $request, Leave $leave)
    {
        $data = $request->validate([
            'personnel_id' => 'sometimes|exists:personnels,id',
            'leave_type_id' => 'sometimes|exists:leave_types,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'leave_balance' => 'sometimes|integer',
            'status' => 'sometimes|in:pending,approved,rejected'
        ]);

        $leave->update($data);

        return response()->json([
            'data' => $leave->refresh()->load(['personnel','leaveType']),
            'message' => 'Leave updated successfully'
        ], 200);
    }


    public function destroy(Leave $leave)
    {
        $leave->delete();

        return response()->json([
            'message' => 'Leave deleted successfully'
        ], 200);
    }
}
