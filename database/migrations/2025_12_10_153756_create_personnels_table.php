<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('personnels', function (Blueprint $table) {
            $table->id();
            $table->string('service_number')->unique();
            $table->string('full_name_kh');
            $table->string('full_name_en');
            $table->string('rank');
            $table->string('unit');
            $table->string('position');
            $table->date('date_of_birth');
            $table->date('date_joined');
            $table->string('marital_status')->nullable();
            $table->string('spouse_name')->nullable();
            $table->date('spouse_dob')->nullable();
            $table->integer('num_children')->default(0);
            $table->json('children_details')->nullable();
            $table->string('contact')->nullable();
            $table->text('address')->nullable();
            $table->string('next_of_kin')->nullable();
            $table->string('education_level')->nullable();
            $table->string('blood_type',5)->nullable();
            $table->string('medical_category',2)->nullable();
            $table->text('notes')->nullable();
            
            // Postgres & MySQL compatible enum
            $table->string('status')->default('active');

            $table->timestamps();
        });
         DB::statement("ALTER TABLE personnels ADD CONSTRAINT status_check CHECK (status IN ('active','retired','resigned'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('personnels');
    }
};
