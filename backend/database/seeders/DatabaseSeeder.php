<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LocationSeeder::class,
        ]);

        // Create admin user
        User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@intracore.com',
            'password' => Hash::make('password'),
            'role_id' => 1, // Admin role
            'location_id' => 1, // Kochi location
        ]);

        // Create test users for each role
        foreach (range(2, 4) as $roleId) {
            User::factory()->create([
                'role_id' => $roleId,
                'location_id' => rand(1, 4),
            ]);
        }
    }
}
