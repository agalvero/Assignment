<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UserController extends Controller
{
    /**
     * Display the user list with search, member dates, and last login activity.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->get()
            ->map(function ($user) {
                // 1. Static date for "Member Since"
                $user->formatted_date = $user->created_at->format('M d, Y');
                
                // 2. Dynamic string for "Last Login" (e.g., "2 hours ago")
                $user->last_login = $user->last_login_at 
                    ? Carbon::parse($user->last_login_at)->diffForHumans() 
                    : 'Never';
                    
                return $user;
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Export users to CSV (Admin Only).
     */
    public function export()
    {
        if (Auth::user()->role !== 'admin') {
            return abort(403, 'Unauthorized action.');
        }

        $fileName = 'system_users_' . date('Y-m-d') . '.csv';
        $users = User::all();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        // Added 'Last Login' to the CSV columns
        $columns = ['ID', 'Name', 'Email', 'Role', 'Member Since', 'Last Login'];

        $callback = function() use($users, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->created_at->format('Y-m-d'),
                    $user->last_login_at ? $user->last_login_at->toDateTimeString() : 'Never',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Create a new user (Admin Only).
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|min:8',
            'role' => 'required|string|in:user,admin',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index');
    }

    /**
     * Update user details.
     */
    public function update(Request $request, User $user)
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $user->id) {
            return abort(403);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'new_password' => 'nullable|string|min:8',
        ];

        if (Auth::user()->role === 'admin') {
            $rules['role'] = 'required|string|in:user,admin';
        }

        $validated = $request->validate($rules);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (isset($validated['role']) && Auth::user()->role === 'admin') {
            $user->role = $validated['role'];
        }

        if (!empty($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return redirect()->route('users.index');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user)
    {
        if (Auth::user()->role === 'admin' || Auth::id() === $user->id) {
            $user->delete();
            return redirect()->route('users.index');
        }
        return abort(403);
    }
}