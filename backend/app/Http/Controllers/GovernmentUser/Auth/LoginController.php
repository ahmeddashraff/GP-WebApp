<?php

namespace App\Http\Controllers\GovernmentUser\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\GovernmentUser\Auth\LoginRequest;
use App\Models\GovernmentUser ;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    use ApiResponses;

    public function login(LoginRequest $request)
    {
        $gov_user = GovernmentUser::where('email',$request->email)->first();
        if(! Hash::check($request->password,$gov_user->password)){
            return $this->error(['email' => ['The provided credentials are incorrect.']],"Invalid Attempt",401);
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

    private function getToken(string $token)
    {
        $tokenArray = explode(' ',$token);
        return explode('|',$tokenArray[1])[0];
    }
}
