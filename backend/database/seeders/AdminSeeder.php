<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('PORTAL_ADMIN_EMAIL');
        $password = env('PORTAL_ADMIN_PASSWORD');

        if (!$email || !$password) {
            throw new \RuntimeException(
                'Set PORTAL_ADMIN_EMAIL and PORTAL_ADMIN_PASSWORD in backend/.env.'
            );
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('PORTAL_ADMIN_NAME', 'Portal Administrator'),
                'role' => 'Super Admin',
                'password' => $password,
            ]
        );
    }
}