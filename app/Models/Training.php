<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'personnel_id',
        'course_name',
        'course_category',
        'location',
        'institution',
        'start_date',
        'end_date',
        'passed',
        'certificate',
        'certificate_file',
    ];

    public function personnel() { return $this->belongsTo(Personnel::class); }
}
