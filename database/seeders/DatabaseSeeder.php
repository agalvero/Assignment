<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{

    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin7894'),
            'role' => 'admin',
        ]);

        
        User::factory()->create([
            'name' => 'Test',
            'email' => 'test@test.com',
            'password' => Hash::make('test1234'),
            'role' => 'user',
        ]);

        // Create 5 random users to populate the table
        User::factory(5)->create();
    }
}