<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            // MySQL: drop unique index, modify column, recreate index
            DB::statement("ALTER TABLE users DROP INDEX users_username_unique");
            DB::statement("ALTER TABLE users MODIFY username VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin");
            DB::statement("ALTER TABLE users ADD UNIQUE INDEX users_username_unique (username)");
        } elseif ($driver === 'pgsql') {
            // PostgreSQL: drop index, alter column collation, recreate index
            DB::statement('DROP INDEX IF EXISTS users_username_unique');
            DB::statement('ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(191) COLLATE "C"');
            DB::statement('CREATE UNIQUE INDEX users_username_unique ON users(username)');
        } else {
            throw new \Exception("Unsupported DB driver: $driver");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE users DROP INDEX users_username_unique");
            DB::statement("ALTER TABLE users MODIFY username VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            DB::statement("ALTER TABLE users ADD UNIQUE INDEX users_username_unique (username)");
        } elseif ($driver === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS users_username_unique');
            DB::statement('ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(191) COLLATE "default"');
            DB::statement('CREATE UNIQUE INDEX users_username_unique ON users(username)');
        } else {
            throw new \Exception("Unsupported DB driver: $driver");
        }
    }
};
