<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Training;
use Illuminate\Support\Facades\Storage;

class TrainingController extends Controller
{
    public function index()
    {
        return Training::with('personnel')->get();
    }

   public function store(Request $request)
{
    $data = $request->validate([
        'personnel_id'=>'required|exists:personnels,id',
        'course_name'=>'required',
        'course_category'=>'required|in:Basic,Advanced,Specialized,Foreign',
        'location'=>'nullable|string',
        'institution'=>'nullable|string',
        'start_date'=>'required|date',
        'end_date'=>'required|date',
        'passed'=>'nullable|boolean',
        'certificate'=>'nullable|boolean',
        'certificate_file'=>'nullable|file|mimes:pdf|max:2048', // max 2MB
    ]);

    // Handle certificate file upload
    if ($request->hasFile('certificate_file')) {
        $file = $request->file('certificate_file');
        $filename = time().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('certificates', $filename, 'public');
        $data['certificate_file'] = $path;
    }

    return Training::create($data);
}


    public function show(Training $training)
    {
        return $training->load('personnel');
    }

    public function update(Request $request, Training $training)
    {
        $data = $request->validate([
            'personnel_id'      => 'sometimes|exists:personnels,id',
            'course_name'       => 'sometimes|string',
            'course_category'   => 'sometimes|in:Basic,Advanced,Specialized,Foreign',
            'location'          => 'sometimes|nullable|string',
            'institution'       => 'sometimes|nullable|string',
            'start_date'        => 'sometimes|date',
            'end_date'          => 'sometimes|date',
            'passed'            => 'sometimes|boolean',
            'certificate'       => 'sometimes|boolean',
            'certificate_file'  => 'sometimes|file|mimes:pdf|max:2048',
            'remove_file'       => 'sometimes|boolean',     // 🆕 client send remove flag
        ]);

        /** 🔥 1) If client uploads a NEW file */
        if ($request->hasFile('certificate_file')) {

            // delete old file
            if ($training->certificate_file && Storage::disk('public')->exists($training->certificate_file)) {
                Storage::disk('public')->delete($training->certificate_file);
            }

            // upload new file
            $file = $request->file('certificate_file');
            $filename = time().'_'.$file->getClientOriginalName();
            $path = $file->storeAs('certificates', $filename, 'public');

            $data['certificate_file'] = $path;
        }

        /** 🔥 2) If client DID NOT upload file → remove file */
        else {

            // delete old file
            if ($training->certificate_file && Storage::disk('public')->exists($training->certificate_file)) {
                Storage::disk('public')->delete($training->certificate_file);
            }

            // set null in DB
            $data['certificate_file'] = null;
        }

        $training->update($data);

        return response()->json([
            'message' => 'Training updated successfully',
            'data' => $training
        ]);
    }



    public function destroy(Training $training)
    {
       
        
        $deletedTraining = $training->toArray();
        $training->delete();
        // return response with deleted data and message
        return response()->json([
            'deleted' => $deletedTraining,
            'message' => "Training deleted successfully!"
        ], 200);
    }
}
