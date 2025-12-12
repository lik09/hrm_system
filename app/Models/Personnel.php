<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_number',
        'full_name_kh',
        'full_name_en',
        'rank',
        'unit',
        'position',
        'date_of_birth',
        'date_joined',
        'marital_status',
        'spouse_name',
        'spouse_dob',
        'num_children',
        'children_details',
        'contact',
        'address',
        'next_of_kin',
        'education_level',
        'blood_type',
        'medical_category',
        'notes',
        'status',
        'photo'
    ];

    protected $casts = [
        'children_details' => 'array',
        'date_of_birth' => 'date',
        'date_joined' => 'date',
        'spouse_dob' => 'date',
    ];

    // Relationships
    public function trainings() { return $this->hasMany(Training::class); }
    public function skills() { return $this->hasOne(Skill::class); }
    public function leaves() { return $this->hasMany(Leave::class); }
    public function alerts() { return $this->hasMany(Alert::class); }
}
