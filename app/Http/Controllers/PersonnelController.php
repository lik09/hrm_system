<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personnel;
use Illuminate\Support\Facades\Storage;

class PersonnelController extends Controller
{
    // List all personnels
    public function index()
    {
        //return Personnel::with(['trainings','skills','leaves','alerts'])->get();
        return Personnel::all();
        
    }

    // Create new personnel
    public function store(Request $request)
    {
        $data = $request->validate([
            'service_number' => 'required|unique:personnels',
            'full_name_kh' => 'required|string',
            'full_name_en' => 'required|string',
            'rank' => 'required|string',
            'unit' => 'required|string',
            'position' => 'required|string',
            'date_of_birth' => 'required|date',
            'date_joined' => 'required|date',
            
            'marital_status' => 'nullable|string',
            'spouse_name' => 'nullable|string',
            'spouse_dob' => 'nullable|date',
            'num_children' => 'nullable|integer|min:0',
            'children_details' => 'nullable|array',
            'contact' => 'nullable|string',
            'address' => 'nullable|string',
            'next_of_kin' => 'nullable|string',
            'education_level' => 'nullable|string',
            'blood_type' => 'nullable|string|max:5',
            'medical_category' => 'nullable|string|max:2',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,retired,resigned',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload photo
        // if ($request->hasFile('photo')) {
        //     $file = $request->file('photo');
        //     $filename = time().'_'.$file->getClientOriginalName();
        //     $path = $file->storeAs('personnel_photos', $filename, 'public');
        //     $data['photo'] = $path;
        // }
        // return Personnel::create($data);

        // Handle photo upload / remove
    if ($request->hasFile('photo')) {
        $file = $request->file('photo');
        $filename = time().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('personnel_photos', $filename, 'public');
        $data['photo'] = $path;
    } elseif ($request->photo === '') {
        // User wants to remove existing photo
        if (isset($request->editing_photo) && $request->editing_photo && file_exists(storage_path('app/public/' . $request->editing_photo))) {
            unlink(storage_path('app/public/' . $request->editing_photo));
        }
        $data['photo'] = null;
    }

    return Personnel::updateOrCreate(
        ['id' => $request->id ?? null],
        $data
    );
    }

    // Show single personnel
    public function show(Personnel $personnel)
    {
        return $personnel->load(['trainings','skills','leaves','alerts']);
    }

    // Update personnel
    public function update(Request $request, Personnel $personnel)
    {
        $data = $request->validate([
            'full_name_kh' => 'nullable|string',
            'full_name_en' => 'nullable|string',
            'rank' => 'nullable|string',
            'unit' => 'nullable|string',
            'position' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'date_joined' => 'nullable|date',
            'marital_status' => 'nullable|string',
            'spouse_name' => 'nullable|string',
            'spouse_dob' => 'nullable|date',
            'num_children' => 'nullable|integer',
            'children_details' => 'nullable', // ← FIX
            'contact' => 'nullable|string',
            'address' => 'nullable|string',
            'next_of_kin' => 'nullable|string',
            'education_level' => 'nullable|string',
            'blood_type' => 'nullable|string',
            'medical_category' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:active,retired,resigned',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Decode JSON children_details
        if ($request->children_details) {
            $data['children_details'] = json_decode($request->children_details, true);
        }

        // If new photo uploaded
        if ($request->hasFile('photo')) {
            if ($personnel->photo && Storage::disk('public')->exists($personnel->photo)) {
                Storage::disk('public')->delete($personnel->photo);
            }

            $file = $request->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('personnel_photos', $filename, 'public');

            $data['photo'] = $path;
        }

        $personnel->update($data);
        return $personnel;
    }


    // Delete personnel
    public function destroy(Personnel $personnel)
    {
        // Capture deleted data
        $deletedPersonnel = $personnel->toArray();

        // Delete photo from storage
        if ($personnel->photo && Storage::disk('public')->exists($personnel->photo)) {
            Storage::disk('public')->delete($personnel->photo);
        }

        // Delete personnel
        $personnel->delete();

        // Return deleted data + message
        return response()->json([
            'deleted' => $deletedPersonnel,
            'message' => "Personnel deleted successfully!"
        ], 200);
    }
}
