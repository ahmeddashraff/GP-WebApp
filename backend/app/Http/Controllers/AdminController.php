<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\Auth\LoginRequest;
use App\Http\Requests\Admin\Auth\RegisterRequest;
use App\Http\Requests\Admin\UpdateAdminInfo;
use App\Http\Requests\Admin\UpdateAdminStatus;
use App\Mail\AdminRestrictionMail;
use App\Models\Admin;
use App\Models\Report;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class AdminController extends Controller
{
    use ApiResponses;
    public function login(LoginRequest $request)
    {
        $admin = Admin::where('email',$request->email)->where(function ($query) {
            $query->where('status', 1);
        })->first();
        if(! Hash::check($request->password,$admin->password)){
            return $this->error(['email' => 'The provided credentials are incorrect.'],"Invalid Attempt",401);
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

    public function addAdmin(RegisterRequest $request)
    {
        if($request->role == 'manager' && $request->user("sanctum")->role !== "owner" )
        {
            return $this->error(['token' => ['invalid token']],"unauthorized",401);
        }

        $department_loc = null;
        if($request->role == 'manager')
        {
            $department_loc = $request->department_loc;
        }else{
            $department_loc = $request->user("sanctum")->department_loc;
        }
        $admin = Admin::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'role'=>$request->role,
            'department_loc'=>$department_loc,

        ]);
        $token = 'Bearer '.  $admin->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $admin->token = $token;
        return $this->data(compact('admin'));
    }

    public function getAllAdminsInDepartment(Request $request)
    {
        $user = $request->user('sanctum')->department_loc;
        $admins = Admin::where('department_loc', $user)
        ->where('role', '!=', 'manager')->where('role', '!=', 'owner')
        ->get();
        if (!$admins) {
            return $this->error(['admins' => 'No admins found by the given location'],"Not Found",404);
        }
        return $this->data(compact('admins'));
    }

    public function getAllManagers(Request $request)
    {
        $admins = Admin::where('role', 'manager')->get();
        if (!$admins) {
            return $this->error(['admins' => 'No admins found'],"Not Found",404);
        }
        return $this->data(compact('admins'));
    }

    public function updateAdminStatus(UpdateAdminStatus $request,int $id)
    {
        $admin = Admin::find($id);
        if(!$admin){
            return $this->error(['admin' => 'admin not found'],"Not Found",404);
        }

        if($request->user("sanctum")->role !== "owner" && $admin->role == 'manager')
        {
            return $this->error(['token' => ['invalid token']],"unauthorized",401);
        }
        // Update the admin status
        $admin->status = $request->status;
        Mail::to($admin->email)->send(new AdminRestrictionMail($admin->full_name, $request->status));
        $admin->update();

        if($request->status == 0)
        {

            $accessToken = PersonalAccessToken::where('tokenable_id', $id)
            ->where('tokenable_type', get_class($admin))
            ->latest()
            ->first();

            if($accessToken)
            {
                $accessToken->delete();
            }
        }

        return $this->data(compact('admin'));
    }

    public function updateAdminInfo(UpdateAdminInfo $request, int $id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return $this->error(['admin' =>'admin not found'],"Not Found",404);
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

    public function delete(Request $request ,int $id)
    {
        $admin = Admin::find($id); // select
        if (!$admin) {
            return $this->error(['admin' => 'admin not found'],"Not Found",404);
        }

        if($request->user("sanctum")->role !== "owner" && $admin->role == "manager")
        {
            return $this->error(['token' => ['invalid token']],"unauthorized",401);
        }

        $admin->delete();
        return $this->success("Admin Deleted Successfully",200);
    }

    public function getStats()
    {
        $totalReports = Report::count();
        $inProgressReports = Report::where('status', 'in_progress')->count();

        $potholesPercentage = $firePercentage = $floodingPercentage = 0;
        if($totalReports !== 0)
        {
            $potholesPercentage = (Report::where('type', 'pothole')->count() / $totalReports) * 100;
            $firePercentage = (Report::where('type', 'fire')->count() / $totalReports) * 100;
            $floodingPercentage = (Report::where('type', 'flooding')->count() / $totalReports) * 100 ;
        }


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
