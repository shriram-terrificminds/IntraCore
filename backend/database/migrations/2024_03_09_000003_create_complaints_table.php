<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('role_id');
            $table->string('complaint_number', 100)->required()->unique();
            $table->string('title', 100)->required();
            $table->text('description', 2000)->required();
            $table->text('resolution_notes')->nullable();
            $table->enum('resolution_status', ['Pending', 'Resolved', 'In-progress', 'Rejected'])->default('Pending');
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('restrict')->onUpdate('cascade');
            $table->foreign('resolved_by')->references('id')->on('users')->onDelete('set null')->onUpdate('cascade');

            $table->index('user_id');
            $table->index('role_id');
            $table->index('resolution_status');
            $table->index(['user_id', 'resolution_status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('complaints');
    }
};
