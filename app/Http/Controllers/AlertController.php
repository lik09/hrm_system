<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alert;
use Illuminate\Database\QueryException;

class AlertController extends Controller
{
    public function index()
    {
        return Alert::with('personnel')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'personnel_id'=>'nullable|exists:personnels,id',
            'alert_type'=>'required|in:Document,Training,Medical,Leave,Attendance',
            'description'=>'required',
            'alert_date'=>'required|date',
            'resolved'=>'nullable|boolean'
        ]);

        try {
            $alert = Alert::create($data);
            return response()->json($alert, 201);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Alert $alert)
    {
        return $alert->load('personnel');
    }

    public function update(Request $request, Alert $alert)
    {
       $data = $request->validate([
            'personnel_id' => 'nullable|exists:personnels,id',
            'alert_type' => 'sometimes|in:Document,Training,Medical,Leave,Attendance',
            'description' => 'sometimes|string',
            'alert_date' => 'sometimes|date',
            'resolved' => 'nullable|boolean',
        ]);

        try {
            $alert->update($data);
            return response()->json($alert);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Alert $alert)
    {
        $alert->delete();
        return response()->json([
            'message' => 'Alert deleted successfully'
        ]);
    }
}
