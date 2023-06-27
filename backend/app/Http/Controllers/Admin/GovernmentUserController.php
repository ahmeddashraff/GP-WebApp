<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GovernmentUser\Auth\RegisterRequest;
use App\Http\Requests\GovernmentUser\UpdateGovernmentUserInfo;
use App\Models\GovernmentUser;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class GovernmentUserController extends Controller
{
    use ApiResponses;

    public function addGovernmentUser(RegisterRequest $request)
    {
        $government_user = GovernmentUser::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'field'=>$request->field,
            'department_loc'=>$request->department_loc,

        ]);

        return $this->data(compact('government_user'));
    }
    public function getAllGovernmentUsersInDepartment(string $location)
    {

        $government_users = GovernmentUser::where('department_loc', $location)->get();
        if (!$government_users) {
            return $this->error(['government_user' => ['No government users found by the given location']],"Not Found",404);
        }
        return $this->data(compact('government_users'));
    }

    public function updateGovernmentUserStatus(Request $request, $id)
    {

        // Find the admin by ID
        $government_user = GovernmentUser::findOrFail($id);

        // Update the govenrment user status
        $government_user->status = $request->status;
        $government_user->update();
        if (!$government_user) {
            return $this->error(['government_user' => ['No government user found by the given id']],"Not Found",404);
        }
        return $this->data(compact('government_user'));
    }

    public function updateGovernmentUserInfo(UpdateGovernmentUserInfo $request, $id)
    {
        $government_user = GovernmentUser::findOrFail($id);
        if (!$government_user) {
            return $this->error(['government_user' => ['No government user found by the given id']],"Not Found",404);
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

    public function delete($id)
    {
        $admin = GovernmentUser::findOrFail($id); // select
        $admin->delete();
        return $this->success("Admin Deleted Successfully",201);
    }}
