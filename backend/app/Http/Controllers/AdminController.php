<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\Auth\LoginRequest;
use App\Http\Requests\Admin\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateAdminInfo;
use App\Http\Requests\Admin\UpdateAdminStatus;
use App\Models\Admin;
use App\Models\Report;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    use ApiResponses;
    public function login(LoginRequest $request)
    {
        $admin = Admin::where('email',$request->email)->first();
        if(! Hash::check($request->password,$admin->password)){
            return $this->error(['email' => ['The provided credentials are incorrect.']],"Invalid Attempt",401);
        }
        $token = 'Bearer '.  $admin->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $admin->token = $token;
        return $this->data(compact('admin'));
    }

    public function logoutCurrent(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();
        return $this->success("Logout successfully from your current token");
    }

    private function getToken(string $token)
    {
        $tokenArray = explode(' ',$token);
        return explode('|',$tokenArray[1])[0];
    }

    public function addAdmin(RegisterRequest $request)
    {
        $admin = Admin::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'role'=>$request->role,
            'department_loc'=>$request->department_loc,

        ]);
        $token = 'Bearer '.  $admin->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $admin->token = $token;
        // dd($admin);
        return $this->data(compact('admin'));
    }

    public function getAllAdminsInDepartment(Request $request)
    {
        $user = $request->user('sanctum')->department_loc;
        $admins = Admin::where('department_loc', $user)
        ->where('role', '!=', 'manager')
        ->get();
        if (!$admins) {
            return $this->error(['admins' => ['No admins found by the given location']],"Not Found",404);
        }
        return $this->data(compact('admins'));
    }

    public function updateAdminStatus(UpdateAdminStatus $request, $id)
    {

        // Find the admin by ID
        $admin = Admin::findOrFail($id);

        // Update the admin status
        $admin->status = $request->status;
        $admin->update();
        if (!$admin) {
            return $this->error(['admin' => ['No admins found by the given id']],"Not Found",404);
        }
        return $this->data(compact('admin'));
    }

    public function updateAdminInfo(UpdateAdminInfo $request, $id)
    {
        $admin = Admin::findOrFail($id);
        if (!$admin) {
            return $this->error(['admin' => ['No admins found by the given id']],"Not Found",404);
        }
        // Update the admin info
        if ($request->filled('phone_number')) {
            $admin->phone_number = $request->phone_number;
        }

        if ($request->filled('password')) {
            $admin->password = Hash::make($request->password);
        }

        if ($request->filled('email')) {
            $admin->email = $request->email;
        }

        $admin->update();

        return $this->data(compact('admin'));
    }

    public function delete($id)
    {
        $admin = Admin::findOrFail($id); // select
        $admin->delete();
        return $this->success("Admin Deleted Successfully",201);
    }

    public function getStats()
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
