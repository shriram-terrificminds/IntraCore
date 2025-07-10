<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('broadcasts', function (Blueprint $table) {
            $table->id();
            $table->text('message');
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->unsignedBigInteger('target_location_id')->nullable();
            $table->unsignedBigInteger('target_role_id')->nullable();
            $table->timestamps();

            $table->foreign('sender_id')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('target_location_id')->references('id')->on('locations')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('target_role_id')->references('id')->on('roles')->onDelete('set null')->onUpdate('cascade');

            $table->index('sender_id');
            $table->index('target_location_id');
            $table->index('target_role_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('broadcasts');
    }
}; 