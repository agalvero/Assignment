<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema; 

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        Vite::prefetch(concurrency: 3);

        /**
         * Listen for the Login event.
         * Every time a user logs in, update their last_login_at column.
         */
        Event::listen(Login::class, function ($event) {
            $event->user->update([
                'last_login_at' => Carbon::now(),
            ]);
        });
    }
}