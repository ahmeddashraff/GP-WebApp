<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminInfo;
use App\Http\Requests\Admin\UpdateAdminStatus;
use App\Models\Admin;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    use ApiResponses;

    public function getAllAdminsInDepartment(string $location)
    {

        $admins = Admin::where('department_loc', $location)
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
}
