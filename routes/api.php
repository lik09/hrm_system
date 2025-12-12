<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\UserController;


Route::apiResource('personnels', PersonnelController::class);
Route::apiResource('trainings', TrainingController::class);
Route::apiResource('skills', SkillController::class);
Route::apiResource('leaves', LeaveController::class);
Route::apiResource('alerts', AlertController::class);
Route::apiResource('users', UserController::class);

// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('personnels', PersonnelController::class);
//     Route::apiResource('trainings', TrainingController::class);
//     Route::apiResource('skills', SkillController::class);
//     Route::apiResource('leaves', LeaveController::class);
//     Route::apiResource('alerts', AlertController::class);
//     Route::apiResource('users', UserController::class);
// });