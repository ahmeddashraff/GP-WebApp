<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\Auth\LoginRequest;
use App\Http\Requests\User\Auth\RegisterRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    use ApiResponses;
    public function login(LoginRequest $request)
    {
        $user = User::where('email',$request->email)->where(function ($query) {
            $query->where('status', 1);
        })->first();
        if( $user == null || ! Hash::check($request->password,$user->password) ){
            return $this->error(['email' => ['The provided credentials are incorrect.']],"Invalid Attempt",401);
        }
        $token = 'Bearer '.  $user->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $user->token = $token;
        return $this->data(compact('user'));
    }

    public function register(RegisterRequest $request)
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

    public function restrict(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        if($user->status == 0)
        {
            return $this->error(['restrict' => ["user can't be restricted."]],"Invalid Attempt",400);
        }
        else
        {

            $currentTimestamp = Carbon::now();
            $restrictionPeriod = explode(" ", $request->restriction_period);
            if($restrictionPeriod[1] == 'h')
            {
                $user->restricted_until = $currentTimestamp->addHours($restrictionPeriod[0]);
            }
            else if($restrictionPeriod[1] == 'd')
            {
                $user->restricted_until = $currentTimestamp->addDays($restrictionPeriod[0]);
            }
            else if($restrictionPeriod[1] == 'm')
            {
                $user->restricted_until = $currentTimestamp->addMonths($restrictionPeriod[0]);
            }
            else
            {
                    return $this->error(['restriction_period' => ['The provided format is invalid.']],"Invalid Attempt",422);
            }
            $user->status = 2;
            $user->update();
            return $this->success("Restriction applied",200);
        }

    }

    public function ban(string $id)
    {
        $user = User::findOrFail($id);
        if($user->status == 0)
        {
            return $this->error(['ban' => ["User is already banned."]],"Invalid Attempt",400);
        }
        $user->status = 0;
        $user->restricted_until = null;
        $user->update();
        return $this->success("Ban applied",200);
    }
    public function unban(string $id)
    {
        $user = User::findOrFail($id);
        if($user->status == 1 || $user->status == 2)
        {
            return $this->error(['unban' => ["user is already unbanned."]],"Invalid Attempt",400);
        }
        else
        {
            $user->status = 1;
            $user->restricted_until = null;
            $user->update();
            return $this->success("user is unbanned",200);
        }
    }

    public function unrestrict(string $id)
    {
        $user = User::findOrFail($id);
        if($user->status == 0)
        {
            return $this->error(['unrestrict' => ["user can't be unrestricted."]],"Invalid Attempt",400);
        }
        else if($user->status == 1)
        {
            return $this->error(['unrestrict' => ["user is already unrestricted."]],"Invalid Attempt",400);
        }
        else
        {
            $user->status = 1;
            $user->update();
            return $this->success("user is unrestricted",200);
        }
    }

    public function updateUserInfo(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return $this->error(['user' => ['No users found by the given id']],"Not Found",404);
        }
        // Update the user info
        if ($request->filled('phone_number')) {
            $user->phone_number = $request->phone_number;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->filled('email')) {
            $user->email = $request->email;
        }

        $user->update();

        return $this->data(compact('user'));
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return $this->data(compact('users'));    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);
        return $this->data(compact('user'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
