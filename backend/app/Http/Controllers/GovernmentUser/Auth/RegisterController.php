<?php

namespace App\Http\Controllers\GovernmentUser\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\GovernmentUser\Auth\RegisterRequest;
use App\Models\GovernmentUser;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
        use ApiResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke(RegisterRequest $request)
    {

            $gov_user = GovernmentUser::create([
                'full_name'=>$request->full_name,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
                'phone_number'=>$request->phone_number,
                'national_id'=>$request->national_id,
                'field'=>$request->field,
                'department_loc'=>$request->department_loc,

            ]);
            $token = 'Bearer '.  $gov_user->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
            $gov_user->token = $token;
            // dd($gov_user);
            return $this->data(compact('gov_user'));
    }
}
