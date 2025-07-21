<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inventory_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id');
            $table->string('request_number', 100)->required()->unique();
            $table->string('title', 100)->required();
            $table->text('description', 2000)->required();
            $table->enum('status', ['Pending', 'Approved', 'Shipped', 'Recieved'])->default('Pending');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

            $table->index('user_id');
            $table->index('role_id');
            $table->index('status');
            $table->index(['user_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventory_requests');
    }
}; 