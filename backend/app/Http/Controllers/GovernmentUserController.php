<?php

namespace App\Http\Controllers;

use App\Http\Requests\GovernmentUser\Auth\LoginRequest;
use App\Http\Requests\GovernmentUser\Auth\RegisterRequest;
use App\Http\Requests\GovernmentUser\UpdateGovernmentUserInfo;
use App\Http\Requests\GovernmentUser\UpdateGovernmentUserStatusRequest;
use App\Mail\AdminRestrictionMail;
use App\Models\GovernmentUser;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class GovernmentUserController extends Controller
{
    use ApiResponses;
    public function login(LoginRequest $request)
    {
        $gov_user = GovernmentUser::where('email',$request->email)->where(function ($query) {
            $query->where('status', 1);
        })->first();
        if(! Hash::check($request->password,$gov_user->password)){
            return $this->error(['email' => 'The provided credentials are incorrect.'],"Invalid Attempt",401);
        }
        $token = 'Bearer '.  $gov_user->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $gov_user->token = $token;
        return $this->data(compact('gov_user'));
    }

    public function logoutCurrent(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();
        return $this->success("Logout successfully from your current token");
    }


    public function addGovernmentUser(RegisterRequest $request)
    {
        $government_user = GovernmentUser::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'field'=>$request->field,
            'department_loc'=>$request->user("sanctum")->department_loc,

        ]);

        return $this->data(compact('government_user'));
    }
    public function getAllGovernmentUsersInDepartment(Request $request)
    {
        $location = $request->user('sanctum')->department_loc;
        $government_users = GovernmentUser::where('department_loc', $location)->get();
        if (!$government_users) {
            return $this->error(['government_user' => 'No government users found by the given location'],"Not Found",404);
        }
        return $this->data(compact('government_users'));
    }

    public function updateGovernmentUserStatus(UpdateGovernmentUserStatusRequest $request,int $id)
    {

        // Find the admin by ID
        $government_user = GovernmentUser::find($id);
        if(!$government_user){
            return $this->error(['government_user' => "government user not found"],"Not Found",404);
        }
        // Update the govenrment user status
        $government_user->status = $request->status;
        Mail::to($government_user->email)->send(new AdminRestrictionMail($government_user->full_name, $request->status));
        $government_user->update();
        if (!$government_user) {
            return $this->error(['government_user' => 'No government user found by the given id'],"Not Found",404);
        }

        if($request->status == 0)
        {

            $accessToken = PersonalAccessToken::where('tokenable_id', $id)
            ->where('tokenable_type', get_class($government_user))
            ->latest()
            ->first();

            if($accessToken)
            {
                $accessToken->delete();
            }
        }
        return $this->data(compact('government_user'));
    }

    public function updateGovernmentUserInfo(UpdateGovernmentUserInfo $request, $id)
    {
        $government_user = GovernmentUser::find($id);

        if (!$government_user) {
            return $this->error(['government_user' => 'No government user found by the given id'],"Not Found",404);
        }
        // Update the admin info
        if ($request->filled('phone_number')) {
            $government_user->phone_number = $request->phone_number;
        }

        if ($request->filled('password')) {
            $government_user->password = Hash::make($request->password);
        }

        if ($request->filled('email')) {
            $government_user->email = $request->email;
        }

        $government_user->update();

        return $this->data(compact('government_user'));
    }

    public function delete(int $id)
    {
        $government_user = GovernmentUser::find($id); // select
        if(!$government_user){
            return $this->error(['government_user' => "government user not found"],"Not Found",404);
        }
        $government_user->delete();
        $accessToken = PersonalAccessToken::where('tokenable_id', $id)
        ->where('tokenable_type', get_class($government_user))
        ->latest()
        ->first();
        if($accessToken)
        {
            $accessToken->delete();
        }
        return $this->success("Government User Deleted Successfully",200);
    }
}
