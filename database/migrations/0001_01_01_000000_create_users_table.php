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
        // ----------------------------
        // Table: users
        // ----------------------------
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('name'); // full name
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->string('role')->default('User'); // enum alternative
            $table->foreignId('personnel_id')->nullable()->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login')->nullable();
            $table->timestamps();
        });

        // Add check constraint for role (Postgres & MySQL)
        DB::statement("ALTER TABLE users ADD CONSTRAINT role_check CHECK (role IN ('Admin','Commander','HR','Officer','User'))");

        // ----------------------------
        // Table: password_reset_tokens
        // ----------------------------
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // ----------------------------
        // Table: sessions
        // ----------------------------
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
