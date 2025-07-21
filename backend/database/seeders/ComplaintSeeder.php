<?php

namespace Database\Seeders;

use App\Models\Complaint;
use Illuminate\Database\Seeder;

class ComplaintSeeder extends Seeder
{
    public function run(): void
    {
        // Create a good mix of statuses
        Complaint::factory()->count(10)->create(); // Default (Pending)
        Complaint::factory()->count(10)->inProgress()->create();
        Complaint::factory()->count(10)->resolved()->create();
        Complaint::factory()->count(10)->rejected()->create();

        // Create some additional records for variety
        Complaint::factory()->count(50)->create();
    }
}
