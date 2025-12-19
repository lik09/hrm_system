<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = ['personnel_id','leave_type_id','start_date','end_date','leave_balance','status'];

    public function personnel() {
        return $this->belongsTo(Personnel::class); 
    }
    public function leaveType()
    {
        return $this->belongsTo(LeaveTypes::class);
    }
}
