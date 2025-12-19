<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeaveTypesController;
use App\Http\Controllers\UserController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('personnels', PersonnelController::class);
    Route::apiResource('trainings', TrainingController::class);
    Route::apiResource('skills', SkillController::class);
    Route::apiResource('leaves', LeaveController::class)
        ->parameters([
            'leaves' => 'leave'
        ]);
    Route::apiResource('alerts', AlertController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('leave-types', LeaveTypesController::class);
    Route::apiResource('attendance', AttendanceController::class);
    Route::middleware('auth:sanctum')->get('/users', [UserController::class, 'index']);
    Route::post('/users/{user}/change-password', [UserController::class, 'changePassword']);
    Route::get('/dashboard/alerts', [DashboardController::class, 'index']);
});
