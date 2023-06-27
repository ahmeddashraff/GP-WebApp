<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserController extends Controller
{
    use ApiResponses;
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
