<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponses;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRequestsAreFromOwner
{
    use ApiResponses;
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tableName = $request->user("sanctum")->getTable();
        $role = $request->user("sanctum")->role;


        // Compare the table name with the expected value
        if ($tableName !== 'admins' || $role !== 'owner') {
            return $this->error(['token' => ['invalid token']],"unauthorized",401);
        }

        return $next($request);
    }
}
