<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Auth\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Traits\ApiResponses;

class RegisterController extends Controller
{
    use ApiResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke(RegisterRequest $request)
    {
        $admin = Admin::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'role'=>$request->role,
            'department_loc'=>$request->department_loc
        ]);
        $token = 'Bearer '.  $admin->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $admin->token = $token;
        // dd($admin);
        return $this->data(compact('admin'));
    }
}
