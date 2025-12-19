<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveTypes extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'days_per_year',
        'description',
    ];

    // Optional: define relationship to leaves
    public function leaves()
    {
        return $this->hasMany(Leave::class, 'leave_type_id');
    }
}
