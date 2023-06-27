<?php

namespace App\Http\Controllers\User\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\User\Auth\RegisterRequest;
use App\Traits\ApiResponses;

class RegisterController extends Controller
{
    use ApiResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke(RegisterRequest $request)
    {
        $user = User::create([
            'full_name'=>$request->full_name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
            'phone_number'=>$request->phone_number,
            'national_id'=>$request->national_id,
            'location'=>$request->location,
            'gender'=>$request->gender,
            'year_of_birth'=>$request->year_of_birth
        ]);
        $token = 'Bearer '.  $user->createToken("Ahmed's iPhone" . '-' . "ios")->plainTextToken;
        $user->token = $token;
        // dd($user);
        return $this->data(compact('user'));
    }
}
