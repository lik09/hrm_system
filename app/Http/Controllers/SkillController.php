<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Skill;

class SkillController extends Controller
{
    public function index()
    {
        return Skill::with('personnel')->get();
    }

    public function store(Request $request)
{
    $data = $request->validate([
        'personnel_id' => 'required|exists:personnels,id',
        'officer_course' => 'sometimes|boolean', 
        'seamanship' => 'sometimes|boolean',  
        'navigation_qualified' => 'sometimes|boolean',
        'engineering_level' => 'sometimes|nullable|integer',
        'boarding_team_qualified' => 'sometimes|boolean',
        'diver_qualification' => 'sometimes|boolean',
        'instructor_qualification' => 'sometimes|boolean',
        'it_cyber_skill' => 'sometimes|string|nullable',
        'language_en' => 'sometimes|string|nullable',
        'language_vn' => 'sometimes|string|nullable',
        'language_th' => 'sometimes|string|nullable',
        'weapon_rifle' => 'sometimes|boolean',
        'weapon_pistol' => 'sometimes|boolean',
        'weapon_mg' => 'sometimes|boolean',
        'driving_license_military' => 'sometimes|boolean',
        'driving_license_civilian' => 'sometimes|boolean',
    ]);

    return Skill::create($data);
}

    public function show(Skill $skill)
    {
        return $skill->load('personnel');
    }

    public function update(Request $request, Skill $skill)
    {
        $skill->update($request->all());
        return $skill;
    }

    public function destroy(Skill $skill)
    {
        $deletedSkill = $skill->toArray();
        $skill->delete();
        return response()->json([
            'deleted' => $deletedSkill,
            'message' => "Skill deleted successfully!"
        ], 200);
    }
}
