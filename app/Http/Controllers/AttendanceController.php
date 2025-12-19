<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Database\QueryException;
class AttendanceController extends Controller
{
    // List all attendance records
    public function index()
    {
        return Attendance::with('personnel')->get();
    }

    // Show single attendance
    public function show($id)
    {
        $attendance = Attendance::with('personnel')->findOrFail($id);
        return $attendance;
    }

    // Create attendance
    public function store(Request $request)
    {
        $data = $request->validate([
            'personnel_id' => 'required|exists:personnels,id',
            'date' => 'required|date',
            'status' => 'required|in:Present,Absent,Late,Excused',
            'remarks' => 'nullable|string',
        ]);

        try {
            $attendance = Attendance::create($data);
            return response()->json($attendance, 201);
        } catch (QueryException $e) {
            // Check if it's a duplicate entry error
            if ($e->getCode() == 23000) { // MySQL duplicate entry error code
                return response()->json([
                    'message' => 'Attendance for this personnel on this date already exists.'
                ], 409); // 409 Conflict
            }
            // Other database errors
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update attendance
    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $data = $request->validate([
            'personnel_id' => 'sometimes|exists:personnels,id',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:Present,Absent,Late,Excused',
            'remarks' => 'nullable|string',
        ]);

        try {
            $attendance->update($data);
            return response()->json($attendance);

        } catch (QueryException $e) {
            if ($e->getCode() == 23000) { 
                return response()->json([
                    'message' => 'Attendance for this personnel on this date already exists.'
                ], 409); // 409 Conflict
            }
           
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete attendance
    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(['message' => 'Attendance deleted successfully']);
    }
}
