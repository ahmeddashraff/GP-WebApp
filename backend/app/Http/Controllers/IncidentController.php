<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    use ApiResponses;

    public function getAllIncidents(Request $request)
    {
        // $location = $request->user("sanctum")->location;
        $incidents = Incident::where('location', $request->location)->get();
        if(!$incidents)
        {
            return $this->error(['incidents' =>'No incidents found'],"Not Found",404);
        }
        return $this->data(compact('incidents'));
    }
}
