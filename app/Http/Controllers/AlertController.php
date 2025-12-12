<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alert;

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

        return Alert::create($data);
    }

    public function show(Alert $alert)
    {
        return $alert->load('personnel');
    }

    public function update(Request $request, Alert $alert)
    {
        $alert->update($request->all());
        return $alert;
    }

    public function destroy(Alert $alert)
    {
        $alert->delete();
        return response()->json(null,204);
    }
}
