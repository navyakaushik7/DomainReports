<?php

namespace Database\Seeders;

use App\Models\Domain;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DomainSeeder extends Seeder
{
    public function run(): void
    {
        // Keep existing records safe. Seed only an empty local database.
        if (Domain::exists()) {
            return;
        }

        $statuses = array_merge(
            array_fill(0, 84, 'Active'),
            array_fill(0, 42, 'Pending'),
            array_fill(0, 25, 'Rejected'),
            array_fill(0, 18, 'Cancelled'),
            array_fill(0, 18, 'Transferred'),
        );

        $ministries = [
            'Ministry of Electronics & IT',
            'Ministry of Home Affairs',
            'Ministry of Health & Family Welfare',
            'Ministry of Education',
            'Ministry of Finance',
            'Ministry of Agriculture',
            'Ministry of Railways',
            'Ministry of Defence',
        ];

        $states = [
            'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
            'Punjab', 'Uttar Pradesh', 'West Bengal', 'Gujarat',
            'Rajasthan', 'Kerala',
        ];

        $departments = [
            'Department of Digital Infrastructure',
            'Department of Public Grievances',
            'Department of Health Services',
            'Department of School Education',
            'Department of Revenue',
            'Department of Agricultural Research',
        ];

        $organisations = [
            'National Informatics Centre',
            'AIIMS New Delhi',
            'IIT Delhi',
            'State Bank of India',
            'Indian Railways Board',
            'Central Water Commission',
        ];

        $categories = [
            'Central Govt', 'State Govt', 'PSU',
            'Autonomous Body', 'Statutory Body',
        ];

        $officers = [
            'Rohit Sharma', 'Ananya Iyer', 'Karan Mehta',
            'Priya Nair', 'Sanjay Gupta', 'Divya Reddy',
            'Arjun Singh', 'Neha Kapoor', 'Vikram Rao', 'Sunita Joshi',
        ];

        $startDate = Carbon::parse('2024-08-01');

        foreach ($statuses as $i => $status) {
            $number = $i + 1;
            $activationDate = $startDate->copy()->addDays(($i * 37) % 730);
            $officer = $officers[$i % count($officers)];

            Domain::create([
                'domain_name' => sprintf('demo-%03d.example.invalid', $number),
                'ministry' => $ministries[$i % count($ministries)],
                'state' => $states[$i % count($states)],
                'department' => $departments[$i % count($departments)],
                'organisation' => $organisations[$i % count($organisations)],
                'org_category' => $categories[$i % count($categories)],
                'nodal_officer' => $officer,
                'email' => sprintf('officer%03d@example.invalid', $number),
                'status' => $status,
                'activation_date' => $activationDate->format('Y-m-d'),
                'created_date' => $activationDate->copy()->subDays(($i % 29) + 1)->format('Y-m-d'),
                'last_updated' => $activationDate->copy()->addDays($i % 10)->format('Y-m-d'),
            ]);
        }
    }
}