<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->constrained()->onDelete('cascade');
            $table->string('leave_type');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('leave_balance')->default(0);
           
            $table->string('status')->default('pending');
           
            $table->timestamps();
        });
       DB::statement("ALTER TABLE leaves ADD CONSTRAINT leaves_status_check CHECK (status IN ('pending','approved','rejected'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
