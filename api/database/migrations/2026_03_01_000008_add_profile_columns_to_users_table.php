<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'telepon')) {
                $table->string('telepon', 30)->nullable()->after('email');
            }

            if (!Schema::hasColumn('users', 'foto')) {
                $table->string('foto', 255)->nullable()->after('telepon');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $dropColumns = [];

            if (Schema::hasColumn('users', 'telepon')) {
                $dropColumns[] = 'telepon';
            }

            if (Schema::hasColumn('users', 'foto')) {
                $dropColumns[] = 'foto';
            }

            if (!empty($dropColumns)) {
                $table->dropColumn($dropColumns);
            }
        });
    }
};
