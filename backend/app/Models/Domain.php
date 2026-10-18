<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domain extends Model
{
    protected $fillable = [
        'domain_name', 'ministry', 'state', 'department', 'organisation', 'org_category',
        'nodal_officer', 'email', 'status', 'activation_date', 'created_date', 'last_updated',
    ];

    protected function casts(): array
    {
        return [
            'activation_date' => 'date:Y-m-d',
            'created_date' => 'date:Y-m-d',
            'last_updated' => 'date:Y-m-d',
        ];
    }
}
