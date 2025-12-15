<?php

namespace App\Providers;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Schema::defaultStringLength(191);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix for MySQL older versions
        Schema::defaultStringLength(191);

        // Force HTTPS in production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}
