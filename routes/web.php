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
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'totalUsers' => User::count(),
            'adminCount' => User::where('role', 'admin')->count(),
        ]);
    })->name('dashboard');

    // Custom Admin Routes
    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    
    /**
     * Bulk Delete Route
     * Must be defined BEFORE the resource route to avoid ID conflicts.
     */
    Route::delete('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');

    // Standard User Resource (index, store, update, destroy)
    Route::resource('users', UserController::class);

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';