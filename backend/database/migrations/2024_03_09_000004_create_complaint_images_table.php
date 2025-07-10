<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('complaint_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('complaint_id');
            $table->string('image_url', 500);
            $table->enum('image_type', ['Before', 'After']);
            $table->timestamp('uploaded_at')->useCurrent();

            $table->foreign('complaint_id')->references('id')->on('complaints')->onDelete('cascade')->onUpdate('cascade');

            $table->index('complaint_id');
            $table->index('image_type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('complaint_images');
    }
}; 