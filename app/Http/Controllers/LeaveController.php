<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;

class LeaveController extends Controller
{
    // List all leaves
    public function index()
    {
        return Leave::with('personnel')->get();
    }

    // Create new leave
    public function store(Request $request)
    {
        $data = $request->validate([
            'personnel_id'=>'required|exists:personnels,id',
            'leave_type'=>'required',
            'start_date'=>'required|date',
            'end_date'=>'required|date',
            'leave_balance'=>'nullable|integer',
            'status'=>'nullable|in:pending,approved,rejected'
        ]);

        return Leave::create($data);
    }

    // Show single leave
    public function show(Leave $leave)
    {
        return $leave->load('personnel');
    }

    // Update leave
    public function update(Request $request, Leave $leave)
    {
        $request->validate([
            'status'=>'nullable|in:pending,approved,rejected'
        ]);

        $leave->update($request->all());
        return $leave;
    }

    // Delete leave
    public function destroy(Leave $leave)
    {
        $leave->delete();
        return response()->json(null,204);
    }
}
