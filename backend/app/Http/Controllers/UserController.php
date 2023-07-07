<?php

namespace App\Http\Controllers;

use App\Http\Controllers\User\Auth\VerificationController;
use App\Http\Requests\User\AddPointsRequest;
use App\Http\Requests\User\Auth\LoginRequest;
use App\Http\Requests\User\Auth\RegisterRequest;
use App\Http\Requests\User\RestrictionRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Mail\UserRestrictionMail;
use App\Models\User;
use App\Services\CheckIfRequestFromAdmin;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class UserController extends Controller
{
    use ApiResponses;



    public function login(LoginRequest $request)
    {
        // $user = User::where('email',$request->email)->where(function ($query) {
        //     $query->where('status', 1);
        // })->first();
        $user = User::where('email',$request->email)->first();
        if( !$user || ! Hash::check($request->password,$user->password) ){
            return $this->error(['email' => 'The provided credentials are incorrect.'],"Invalid Attempt",401);
        }
        if( $user->status == 2){
            return $this->error(['user' => 'you are restricted until '.$user->restricted_until],"Invalid Attempt",401);
        }
        if( $user->status == 0){
            return $this->error(['user' => 'you are banned.'],"Invalid Attempt",401);
        }
        // VerificationController::send
        $token = 'Bearer '.  $user->createToken("Ahmed's laptop" . '-' . "windows")->plainTextToken;
        $user->token = $token;
        return $this->data(compact('user'));
    }

    public function register(RegisterRequest $request)
    {

        if($request->year_of_birth > Carbon::now()->subYears(16)->year)
        {
            return $this->error(['age' => 'you must be 16 years old or older.'],"Invalid year of birth",400);
        }
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

    public function restrict(RestrictionRequest $request, int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' =>"user not found"],"Not Found",404);
        }

        if($user->status == 0)
        {
            return $this->error(['restrict' => "user can't be restricted."],"Invalid Attempt",400);
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
                    return $this->error(['restriction_period' => 'The provided format is invalid.'],"Invalid Attempt",422);
            }
            $user->status = 2;
            $user->update();

            $accessToken = PersonalAccessToken::where('tokenable_id', $id)
            ->where('tokenable_type', get_class($user))
            ->latest()
            ->first();
            Mail::to($user->email)->send(new UserRestrictionMail($user->full_name, "restricted until ". $user->restricted_until));

            if($accessToken)
            {
                $accessToken->delete();
            }
            return $this->success("Restriction applied",200);
        }

    }

    public function ban(int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }

        if($user->status == 0)
        {
            return $this->error(['user' => "User is already banned."],"Invalid Attempt",400);
        }
        $user->status = 0;
        $user->restricted_until = null;

        $user->update();
        Mail::to($user->email)->send(new UserRestrictionMail($user->full_name, "banned"));

        $accessToken = PersonalAccessToken::where('tokenable_id', $id)
        ->where('tokenable_type', get_class($user))
        ->latest()
        ->first();
        if($accessToken)
        {
            $accessToken->delete();
        }
        return $this->success("Ban applied",200);
    }
    public function unban(int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }

        if($user->status == 1 || $user->status == 2)
        {
            return $this->error(['user' => "user is already unbanned."],"Invalid Attempt",400);
        }
        else
        {
            $user->status = 1;
            $user->restricted_until = null;
            $user->update();
            Mail::to($user->email)->send(new UserRestrictionMail($user->full_name, "unbanned"));

            return $this->success("user is unbanned",200);
        }
    }

    public function unrestrict(int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }

        if($user->status == 0)
        {
            return $this->error(['unrestrict' => "user can't be unrestricted."],"Invalid Attempt",400);
        }
        else if($user->status == 1)
        {
            return $this->error(['unrestrict' => "user is already unrestricted."],"Invalid Attempt",400);
        }
        else
        {
            $user->status = 1;
            $user->restricted_until = null;
            $user->update();
            Mail::to($user->email)->send(new UserRestrictionMail($user->full_name, "unrestricted"));

            return $this->success("user is unrestricted",200);
        }
    }

    public function addPoints(Request $request, int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }
        $user->points = $user->points + $request->points;
        $user->update();

        return $this->success("points are added successfully",200);
    }

    public function update(UpdateUserRequest $request)
    {

        $user = User::find($request->user('sanctum')->id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
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

        return $this->success("user is updated successfully", 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return $this->data(compact('users'));

    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $user = User::find($id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }

        return $this->data(compact('user'));
    }


    public function getProfile(Request $request)
    {
        $user = User::find($request->user('sanctum')->id);
        if(!$user){
            return $this->error(['user' => "user not found"],"Not Found",404);
        }

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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
