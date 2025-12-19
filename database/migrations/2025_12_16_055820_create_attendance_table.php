<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to personnels table
            $table->foreignId('personnel_id')
                  ->constrained('personnels')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
            
            // Attendance date
            $table->date('date');

            $table->string('status')->default('Present');

            // Optional remarks
            $table->text('remarks')->nullable();

            $table->timestamps();

            // Ensure one record per personnel per day
            $table->unique(['personnel_id', 'date']);
        });

        DB::statement("
            ALTER TABLE attendance
            ADD CONSTRAINT attendance_status_check
            CHECK (status IN ('Present','Absent','Late','Excused'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check");
        } elseif ($driver === 'mysql') {
            DB::statement("ALTER TABLE attendance DROP CHECK attendance_status_check");
        }
        Schema::dropIfExists('attendance');
    }
};
