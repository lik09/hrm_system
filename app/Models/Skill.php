<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'personnel_id','officer_course','seamanship','navigation_qualified',
        'engineering_level','boarding_team_qualified','diver_qualification',
        'instructor_qualification','it_cyber_skill','language_en','language_vn',
        'weapon_rifle','weapon_pistol','weapon_mg','driving_license_military','driving_license_civilian'
    ];

    public function personnel() { return $this->belongsTo(Personnel::class); }
}
