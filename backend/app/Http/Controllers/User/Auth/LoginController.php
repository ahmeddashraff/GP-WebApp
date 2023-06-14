<?php

namespace App\Http\Controllers\User\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\Auth\LoginRequest;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    use ApiResponses;

    public function login(LoginRequest $request)
    {
        $user = User::where('email',$request->email)->first();
        if(! Hash::check($request->password,$user->password)){
            return $this->error(['email' => ['The provided credentials are incorrect.']],"Invalid Attempt",401);
        }
        $token = 'Bearer '.  $user->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $user->token = $token;
        return $this->data(compact('user'));
    }

    public function logoutAll(Request $request)
    {
        $request->user('sanctum')->tokens()->delete();
        return $this->success("Logout successfully from all device");
    }

    public function logoutCurrent(Request $request)
    {
        $request->user('sanctum')->currentAccessToken()->delete();
        return $this->success("Logout successfully from your current token");
    }
    public function logoutOther(Request $request)
    {
        $tokenId = $this->getToken($request->header('old-token'));
        $request->user('sanctum')->tokens()->where('id',$tokenId)->delete();
        return $this->success("Logout successfully from {$tokenId} Token");

    }

    private function getToken(string $token)
    {
        $tokenArray = explode(' ',$token);
        return explode('|',$tokenArray[1])[0];
    }
}
