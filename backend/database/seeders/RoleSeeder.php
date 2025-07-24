<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => RoleEnum::ADMIN->value,
            ],
            [
                'name' => RoleEnum::DEVOPS->value,
            ],
            [
                'name' => RoleEnum::HR->value,
            ],
            [
                'name' => RoleEnum::EMPLOYEE->value,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
