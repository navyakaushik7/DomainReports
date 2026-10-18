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
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->string('domain_name', 253)->unique();
            $table->string('ministry', 160)->index();
            $table->string('state', 100)->index();
            $table->string('department', 180)->index();
            $table->string('organisation', 180)->index();
            $table->string('org_category', 80)->index();
            $table->string('nodal_officer', 120);
            $table->string('email', 254);
            $table->string('status', 24)->index();
            $table->date('activation_date')->nullable()->index();
            $table->date('created_date')->nullable();
            $table->date('last_updated')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domains');
    }
};
