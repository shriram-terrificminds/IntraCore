<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\InventoryRequest;
use App\Models\Location;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LocationSeeder::class,
        ]);

        // Get roles and locations from DB
        $roles = Role::pluck('id', 'name');
        $locations = Location::pluck('id', 'name');

        // Users
        $users = [
            [ 'first_name' => 'Nick', 'last_name' => 'Fury', 'email' => 'fury.admin@intracore.com', 'role' => 'Admin', 'location' => 'Kochi' ],
            [ 'first_name' => 'Maria', 'last_name' => 'Hill', 'email' => 'hill.admin@intracore.com', 'role' => 'Admin', 'location' => 'Trivandrum' ],
            [ 'first_name' => 'Phil', 'last_name' => 'Coulson', 'email' => 'coulson.admin@intracore.com', 'role' => 'Admin', 'location' => 'Bangalore' ],
            [ 'first_name' => 'Melinda', 'last_name' => 'May', 'email' => 'may.admin@intracore.com', 'role' => 'Admin', 'location' => 'Perth' ],
            [ 'first_name' => 'Tony', 'last_name' => 'Stark', 'email' => 'stark.hr@intracore.com', 'role' => 'Hr', 'location' => 'Kochi' ],
            [ 'first_name' => 'Pepper', 'last_name' => 'Potts', 'email' => 'potts.hr@intracore.com', 'role' => 'Hr', 'location' => 'Trivandrum' ],
            [ 'first_name' => 'Happy', 'last_name' => 'Hogan', 'email' => 'hogan.hr@intracore.com', 'role' => 'Hr', 'location' => 'Bangalore' ],
            [ 'first_name' => 'James', 'last_name' => 'Rhodes', 'email' => 'rhodes.hr@intracore.com', 'role' => 'Hr', 'location' => 'Perth' ],
            [ 'first_name' => 'Clint', 'last_name' => 'Barton', 'email' => 'clint.devops@intracore.com', 'role' => 'Devops', 'location' => 'Kochi' ],
            [ 'first_name' => 'Laura', 'last_name' => 'Barton', 'email' => 'laura.devops@intracore.com', 'role' => 'Devops', 'location' => 'Trivandrum' ],
            [ 'first_name' => 'Kate', 'last_name' => 'Bishop', 'email' => 'kate.devops@intracore.com', 'role' => 'Devops', 'location' => 'Bangalore' ],
            [ 'first_name' => 'Jack', 'last_name' => 'Duquesne', 'email' => 'jack.devops@intracore.com', 'role' => 'Devops', 'location' => 'Perth' ],
            [ 'first_name' => 'Steve', 'last_name' => 'Rogers', 'email' => 'steve.employee@intracore.com', 'role' => 'Employee', 'location' => 'Kochi' ],
            [ 'first_name' => 'Sam', 'last_name' => 'Wilson', 'email' => 'sam.employee@intracore.com', 'role' => 'Employee', 'location' => 'Trivandrum' ],
            [ 'first_name' => 'Bucky', 'last_name' => 'Barnes', 'email' => 'bucky.employee@intracore.com', 'role' => 'Employee', 'location' => 'Bangalore' ],
            [ 'first_name' => 'Sharon', 'last_name' => 'Carter', 'email' => 'sharon.employee@intracore.com', 'role' => 'Employee', 'location' => 'Perth' ],
            [ 'first_name' => 'Bruce', 'last_name' => 'Banner', 'email' => 'bruce.devops@intracore.com', 'role' => 'Devops', 'location' => 'Kochi' ],
            [ 'first_name' => 'Natasha', 'last_name' => 'Romanoff', 'email' => 'natasha.hr@intracore.com', 'role' => 'Hr', 'location' => 'Bangalore' ],
            [ 'first_name' => 'Peter', 'last_name' => 'Parker', 'email' => 'peter.employee@intracore.com', 'role' => 'Employee', 'location' => 'Trivandrum' ],
            [ 'first_name' => 'Wanda', 'last_name' => 'Maximoff', 'email' => 'wanda.employee@intracore.com', 'role' => 'Employee', 'location' => 'Kochi' ],
            [ 'first_name' => 'Vision', 'last_name' => 'Maximoff', 'email' => 'vision.admin@intracore.com', 'role' => 'Admin', 'location' => 'Bangalore' ],
        ];

        $userIds = [];
        foreach ($users as $user) {
            $u = User::create([
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'role_id' => $roles[$user['role']],
                'location_id' => $locations[$user['location']],
                'password' => Hash::make('password'),
            ]);
            $userIds[$user['email']] = $u->id;
        }

        // Inventory Requests
        // Additional inventory requests
        $inventoryRequests[] = [
            'user_email' => 'bruce.devops@intracore.com',
            'role' => 'Devops',
            'title' => 'Server RAM Upgrade',
            'description' => 'Requesting RAM upgrade for production server.',
            'status' => 'Pending',
            'approved_by' => null,
            'approved_at' => null,
        ];
        $inventoryRequests[] = [
            'user_email' => 'natasha.hr@intracore.com',
            'role' => 'Hr',
            'title' => 'Office Chairs',
            'description' => 'Need 10 new ergonomic office chairs.',
            'status' => 'Approved',
            'approved_by' => $userIds['stark.hr@intracore.com'] ?? null,
            'approved_at' => now(),
        ];
        $inventoryRequests[] = [
            'user_email' => 'wanda.employee@intracore.com',
            'role' => 'Hr',
            'title' => 'Stationery Supplies',
            'description' => 'Requesting pens, notebooks, and markers.',
            'status' => 'Received',
            'approved_by' => $userIds['potts.hr@intracore.com'] ?? null,
            'approved_at' => now(),
        ];
        $inventoryRequests = [
            [
                'user_email' => 'fury.admin@intracore.com',
                'role' => 'Devops',
                'title' => 'Laptop Request',
                'description' => 'Need a new laptop for IT admin.',
                'status' => 'Pending',
                'approved_by' => null,
                'approved_at' => null,
            ],
            [
                'user_email' => 'stark.hr@intracore.com',
                'role' => 'Devops',
                'title' => 'Monitor Request',
                'description' => 'HR needs two monitors for new joiners.',
                'status' => 'Approved',
                'approved_by' => $userIds['fury.admin@intracore.com'],
                'approved_at' => now(),
            ],
            [
                'user_email' => 'clint.devops@intracore.com',
                'role' => 'Hr',
                'title' => 'Coffee mug replacement',
                'description' => 'Devops team requests coffee mugs to be replaced.',
                'status' => 'Shipped',
                'approved_by' => $userIds['stark.hr@intracore.com'],
                'approved_at' => now(),
            ],
            [
                'user_email' => 'steve.employee@intracore.com',
                'role' => 'Hr',
                'title' => 'Plates and spoons',
                'description' => 'The pantry is in short of plates, spoons and forks, please provide with the same.',
                'status' => 'Received',
                'approved_by' => $userIds['stark.hr@intracore.com'],
                'approved_at' => now(),
            ],
        ];
        foreach ($inventoryRequests as $i => $req) {
            InventoryRequest::create([
                'user_id' => $userIds[$req['user_email']],
                'role_id' => $roles[$req['role']],
                'request_number' => 500000 + $i,
                'title' => $req['title'],
                'description' => $req['description'],
                'status' => $req['status'],
                'approved_by' => $req['approved_by'],
                'approved_at' => $req['approved_at'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Complaints
        // Additional complaints
        $complaints[] = [
            'user_email' => 'peter.employee@intracore.com',
            'role' => 'Devops',
            'title' => 'WiFi Connectivity Issue',
            'description' => 'Unable to connect to office WiFi.',
            'resolution_status' => 'Pending',
            'resolution_notes' => null,
            'resolved_by' => null,
            'resolved_at' => null,
        ];
        $complaints[] = [
            'user_email' => 'vision.admin@intracore.com',
            'role' => 'Devops',
            'title' => 'Printer Not Working',
            'description' => 'Printer in Bangalore office is not functioning.',
            'resolution_status' => 'In-progress',
            'resolution_notes' => 'Technician assigned.',
            'resolved_by' => null,
            'resolved_at' => null,
        ];
        $complaints[] = [
            'user_email' => 'wanda.employee@intracore.com',
            'role' => 'Hr',
            'title' => 'Air Conditioning Issue',
            'description' => 'AC not cooling properly in Kochi office.',
            'resolution_status' => 'Resolved',
            'resolution_notes' => 'AC serviced and fixed.',
            'resolved_by' => $userIds['fury.admin@intracore.com'] ?? null,
            'resolved_at' => now(),
        ];
        $complaints = [
            [
                'user_email' => 'fury.admin@intracore.com',
                'role' => 'Devops',
                'title' => 'Network Issue',
                'description' => 'Internet is down in Perth office.',
                'resolution_status' => 'Pending',
                'resolution_notes' => null,
                'resolved_by' => null,
                'resolved_at' => null,
            ],
            [
                'user_email' => 'stark.hr@intracore.com',
                'role' => 'Devops',
                'title' => 'Laptop is not coming out of BIOS screen',
                'description' => 'My laption is stuck in BIOS screen for past few hours and not able to do any work.',
                'resolution_status' => 'Resolved',
                'resolution_notes' => 'Devops team investigating.',
                'resolved_by' => $userIds['clint.devops@intracore.com'],
                'resolved_at' => now(),
            ],
            [
                'user_email' => 'clint.devops@intracore.com',
                'role' => 'Hr',
                'title' => 'Replace employee handbook',
                'description' => 'The employee handbook in our library is pretty old, and needs to be replaced with latest ones.',
                'resolution_status' => 'In-progress',
                'resolution_notes' => 'Added new handbook to library.',
                'resolved_by' => null,
                'resolved_at' => null,
            ],
            [
                'user_email' => 'steve.employee@intracore.com',
                'role' => 'Devops',
                'title' => 'Keyboard not working',
                'description' => 'Few keys in my keyboard is not working, please help in resolving this.',
                'resolution_status' => 'Rejected',
                'resolution_notes' => 'Devops team investigating.',
                'resolved_by' => $userIds['clint.devops@intracore.com'],
                'resolved_at' => now(),
            ],
        ];
        foreach ($complaints as $i => $comp) {
            Complaint::create([
                'user_id' => $userIds[$comp['user_email']],
                'role_id' => $roles[$comp['role']],
                'complaint_number' => 300000 + $i,
                'title' => $comp['title'],
                'description' => $comp['description'],
                'resolution_status' => $comp['resolution_status'],
                'resolution_notes' => $comp['resolution_notes'],
                'resolved_by' => $comp['resolved_by'],
                'resolved_at' => $comp['resolved_at'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
