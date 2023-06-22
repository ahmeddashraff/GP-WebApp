<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

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
}
