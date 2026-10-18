<?php

use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [SessionController::class, 'login'])->middleware('throttle:6,1');

Route::middleware(['auth:sanctum', 'can:viewReports'])->group(function () {
    Route::post('/logout', [SessionController::class, 'logout']);
    Route::get('/user', fn (Request $request) => $request->user()->only(['id', 'name', 'email', 'role']));
    Route::get('/reports', [ReportController::class, 'index']);
    Route::post('/reports/search', [ReportController::class, 'search']);
    Route::get('/reports/nodal-officer', [ReportController::class, 'nodalOfficer']);
    Route::get('/reports/summary', [ReportController::class, 'summary']);
    Route::get('/reports/options', [ReportController::class, 'options']);
    Route::get('/reports/export/csv', [ReportController::class, 'exportCsv']);
});
