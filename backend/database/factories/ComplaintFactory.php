<?php

namespace Database\Factories;

use App\Enums\ComplaintStatusEnum;
use App\Models\Complaint;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        $hrDevopsRoles = Role::whereIn('name', ['Hr', 'Devops'])->pluck('id');
        $randomUser = User::inRandomOrder()->first();
        $randomRoleId = $hrDevopsRoles->random();

        return [
            'user_id' => $randomUser->id,
            'role_id' => $randomRoleId,
            'complaint_number' => (string)$this->faker->unique()->numberBetween(600000, 999999),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'resolution_notes' => $this->faker->optional()->paragraph(),
            'resolution_status' => $this->faker->randomElement([
                ComplaintStatusEnum::PENDING->value,
                ComplaintStatusEnum::IN_PROGRESS->value,
                ComplaintStatusEnum::RESOLVED->value,
                ComplaintStatusEnum::REJECTED->value,
            ]),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function inProgress(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'resolution_status' => ComplaintStatusEnum::IN_PROGRESS->value,
            ];
        });
    }

    public function resolved(): Factory
    {
        return $this->state(function (array $attributes) {
            $adminHrDevopsUser = User::whereHas('role', function ($query) {
                $query->whereIn('name', ['Admin', 'Hr', 'Devops']);
            })->inRandomOrder()->first();
            return [
                'resolution_status' => ComplaintStatusEnum::RESOLVED->value,
                'resolved_by' => $adminHrDevopsUser ? $adminHrDevopsUser->id : null,
                'resolved_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            ];
        });
    }

    public function rejected(): Factory
    {
        return $this->state(function (array $attributes) {
            $adminHrDevopsUser = User::whereHas('role', function ($query) {
                $query->whereIn('name', ['Admin', 'Hr', 'Devops']);
            })->inRandomOrder()->first();
            return [
                'resolution_status' => ComplaintStatusEnum::REJECTED->value,
                'resolved_by' => $adminHrDevopsUser ? $adminHrDevopsUser->id : null,
                'resolved_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
            ];
        });
    }
}
