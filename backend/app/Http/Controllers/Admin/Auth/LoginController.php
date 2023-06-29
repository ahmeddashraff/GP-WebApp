<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Auth\LoginRequest;
use App\Models\Admin;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
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
}