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
            $table->foreignId('personnel_id')->constrained('personnels')->onDelete('cascade');
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('leave_balance')->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    // CHECK constraint (MySQL 8+ & PostgreSQL)
        DB::statement("
            ALTER TABLE leaves
            ADD CONSTRAINT leaves_status_check
            CHECK (status IN ('pending','approved','rejected'))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE leaves DROP CONSTRAINT IF EXISTS leaves_status_check");
        } elseif ($driver === 'mysql') {
            DB::statement("ALTER TABLE leaves DROP CHECK leaves_status_check");
        }

        Schema::dropIfExists('leaves');
    }
};
