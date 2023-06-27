<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    use ApiResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $totalReports = Report::count();
        $inProgressReports = Report::where('status', 'in_progress')->count();

        $potholesPercentage = (Report::where('type', 'pothole')->count() / $totalReports) * 100;
        $firePercentage = (Report::where('type', 'fire')->count() / $totalReports) * 100;
        $floodingPercentage = (Report::where('type', 'flooding')->count() / $totalReports) * 100 ;

        $registeredUsers = User::count();

        $statistics = new \stdClass();
        $statistics->total_reports = $totalReports;
        $statistics->in_progress_reports = $inProgressReports;
        $statistics->potholes_percentage = $potholesPercentage;
        $statistics->fire_percentage = $firePercentage;
        $statistics->flooding_percentage = $floodingPercentage;
        $statistics->registered_users = $registeredUsers;

        return $this->data(compact('statistics'));
    }
}
