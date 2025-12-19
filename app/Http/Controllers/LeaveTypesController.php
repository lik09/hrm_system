<?php

namespace App\Http\Controllers;


use App\Models\LeaveTypes;
use Illuminate\Http\Request;

class LeaveTypesController extends Controller
{
    // List all leave types
   public function index()
    {
        
        return LeaveTypes::all();
        
    }

    // Create new leave type
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'days_per_year' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $leaveType = LeaveTypes::create($data);

        return response()->json($leaveType, 201);
    }

    // Show single leave type
    public function show($id)
    {
        $leaveType = LeaveTypes::findOrFail($id);
        return response()->json($leaveType);
    }

    // Update leave type
    public function update(Request $request, $id)
    {
        $leaveType = LeaveTypes::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'days_per_year' => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $leaveType->update($data);

        return response()->json($leaveType);
    }

    // Delete leave type
    public function destroy($id)
    {
        $leaveType = LeaveTypes::findOrFail($id);
        $leaveType->delete();

        return response()->json(['message' => 'Leave type deleted successfully.']);
    }
}
