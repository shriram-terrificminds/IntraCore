<?php

namespace Database\Factories;

use App\Enums\InventoryRequestStatusEnum;
use App\Models\InventoryRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryRequestFactory extends Factory
{
    protected $model = InventoryRequest::class;

    public function definition(): array
    {
        $hrDevopsRoles = Role::whereIn('name', ['Hr', 'Devops'])->pluck('id');
        $randomUser = User::inRandomOrder()->first();
        $randomRoleId = $hrDevopsRoles->random();

        return [
            'user_id' => $randomUser->id,
            'role_id' => $randomRoleId,
            'request_number' => (string)$this->faker->unique()->numberBetween(300000, 999999),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement([
                InventoryRequestStatusEnum::PENDING->value,
                InventoryRequestStatusEnum::APPROVED->value,
                InventoryRequestStatusEnum::SHIPPED->value,
                InventoryRequestStatusEnum::RECEIVED->value,
                InventoryRequestStatusEnum::REJECTED->value,
            ]),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function approved(): Factory
    {
        return $this->state(function (array $attributes) {
            $adminUser = User::whereHas('role', function ($query) {
                $query->where('name', 'Admin');
            })->inRandomOrder()->first();
            return [
                'status' => InventoryRequestStatusEnum::APPROVED->value,
                'approved_by' => $adminUser ? $adminUser->id : null,
                'approved_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            ];
        });
    }

    public function shipped(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => InventoryRequestStatusEnum::SHIPPED->value,
                'approved_at' => $attributes['approved_at'] ?? $this->faker->dateTimeBetween('-6 months', 'now'),
            ];
        })->approved(); // Ensure it's approved before being shipped
    }

    public function received(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => InventoryRequestStatusEnum::RECEIVED->value,
            ];
        })->shipped(); // Ensure it's shipped before being received
    }

    public function rejected(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => InventoryRequestStatusEnum::REJECTED->value,
            ];
        });
    }
}
