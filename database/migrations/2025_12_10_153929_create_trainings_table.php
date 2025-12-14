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
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->constrained()->onDelete('cascade');
            $table->string('course_name');
            $table->enum('course_category', ['Basic','Advanced','Intermediate','Specialized','Foreign']);
            $table->string('location')->nullable();
            $table->string('institution')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('passed')->default(false);
            $table->boolean('certificate')->default(false);
            $table->string('certificate_file')->nullable();
            $table->timestamps();
        });

        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainings');
    }
};
