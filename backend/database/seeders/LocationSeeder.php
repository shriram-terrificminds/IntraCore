<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Kochi',
            ],
            [
                'name' => 'Trivandrum',
            ],
            [
                'name' => 'Bangalore',
            ],
            [
                'name' => 'Perth',
            ],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
