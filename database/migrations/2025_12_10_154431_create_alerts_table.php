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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->nullable()->constrained()->onDelete('cascade');
          //  $table->enum('alert_type',['Document','Training','Medical','Leave','Attendance']);
            $table->string('alert_type');
            
            $table->text('description');
            $table->date('alert_date');
            $table->boolean('resolved')->default(false);
            $table->timestamps();
        });
        DB::statement("ALTER TABLE alerts ADD CONSTRAINT alert_type_check CHECK (alert_type IN ('Document','Training','Medical','Leave','Attendance'))");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
