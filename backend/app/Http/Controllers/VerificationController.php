<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\VerificationMail;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    use ApiResponses;
    public function send(Request $request)
    {
        $user = $request->user('sanctum');
        $token = $request->header('Authorization');
        $verification_code = rand(100000,999999);
        $user->verification_code = $verification_code;
        $user->save();
        Mail::to($user->email)->send(new VerificationMail($verification_code));

        $user->token = $token;
        return $this->data(compact('user'));
    }
    public function verify(Request $request)
    {
        // dd(config('auth.guards'));
        // dd($request->user('sanctum'));
        $user = $request->user('sanctum');
        if(!$user)
        {
            return $this->error(['token'=>'invalid token'], "unauthorized", 401);
        }
        $token = $request->header('Authorization');
        if($user->verification_code == $request->verification_code)
        {
            $user->email_verified_at = date("Y-m-d H:i:s");
            $user->save();
            $user->token = $token;
            return $this->data(compact('user'));
        }
        else
        {
            return $this->error(['verification_code'=>'wrong code'], "Please try again", 401);
        }
    }
}
