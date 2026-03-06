<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController; 
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard logic - Passing total and admin counts
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'totalUsers' => User::count(),
            'adminCount' => User::where('role', 'admin')->count(),
        ]);
    })->name('dashboard');

    // EXPORT MUST BE ABOVE RESOURCE
    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');

    // Standard CRUD routes
    Route::resource('users', UserController::class);

    // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';