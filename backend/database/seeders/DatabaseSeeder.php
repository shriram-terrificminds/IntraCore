<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Role;
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

        $roles = Role::all();
        $locations = Location::all();

        // Create 2 users for each role
        foreach ($roles as $role) {
            for ($i = 0; $i < 2; $i++) {
                User::factory()->create([
                    'first_name' => $role->name . 'User' . ($i + 1),
                    'last_name' => 'Test',
                    'email' => strtolower($role->name) . '_user' . ($i + 1) . '@intracore.com',
                    'password' => Hash::make('password'),
                    'role_id' => $role->id,
                    'location_id' => $locations->random()->id,
                ]);
            }
        }

        // Call inventory and complaint seeders after users are created
        $this->call([
            InventoryRequestSeeder::class,
            ComplaintSeeder::class,
        ]);
    }
}
