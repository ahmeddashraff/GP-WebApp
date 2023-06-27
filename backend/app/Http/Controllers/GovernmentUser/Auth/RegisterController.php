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


    }
}
