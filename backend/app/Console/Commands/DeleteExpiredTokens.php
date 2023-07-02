<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;

class DeleteExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:delete-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete expired Sanctum personal access tokens';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        PersonalAccessToken::where('expires_at', '<=', Carbon::now())->delete();

        $this->info('Expired tokens deleted successfully.');    }
}
