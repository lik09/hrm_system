<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->constrained()->onDelete('cascade');
            $table->boolean('officer_course')->default(false);
            $table->boolean('seamanship')->default(false);
            $table->boolean('navigation_qualified')->default(false);
            $table->tinyInteger('engineering_level')->nullable();
            $table->boolean('boarding_team_qualified')->default(false);
            $table->boolean('diver_qualification')->default(false);
            $table->boolean('instructor_qualification')->default(false);
            $table->text('it_cyber_skill')->nullable();
            $table->string('language_en')->nullable();
            $table->string('language_vn')->nullable();
            $table->boolean('weapon_rifle')->default(false);
            $table->boolean('weapon_pistol')->default(false);
            $table->boolean('weapon_mg')->default(false);
            $table->boolean('driving_license_military')->default(false);
            $table->boolean('driving_license_civilian')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
