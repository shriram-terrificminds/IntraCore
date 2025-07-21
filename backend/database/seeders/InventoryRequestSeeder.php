<?php

namespace Database\Seeders;

use App\Models\InventoryRequest;
use Illuminate\Database\Seeder;

class InventoryRequestSeeder extends Seeder
{
    public function run(): void
    {
        // Create a good mix of statuses
        InventoryRequest::factory()->count(10)->create(); // Default (Pending)
        InventoryRequest::factory()->count(10)->approved()->create();
        InventoryRequest::factory()->count(10)->shipped()->create();
        InventoryRequest::factory()->count(10)->received()->create();
        InventoryRequest::factory()->count(10)->rejected()->create();

        // Create some additional records for variety
        InventoryRequest::factory()->count(50)->create();
    }
}
