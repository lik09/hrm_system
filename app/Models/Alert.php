<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = ['personnel_id','alert_type','description','alert_date','resolved'];

    public function personnel() { return $this->belongsTo(Personnel::class); }
}
