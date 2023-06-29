<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreReportRequest;
use App\Http\Requests\Admin\Reports\UpdateReportRequest;
use App\Models\Report;
use App\Services\HasMedia;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponses;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Report::all();
        return $this->data(compact('reports'));
    }

    public function markReportAsDone(string $id)
    {

        // Find the admin by ID
        $report = Report::findOrFail($id);

        // Update the report status
        $report->status = 1;
        $report->update();
        if (!$report) {
            return $this->error(['report' => ['No reports found by the given id']],"Not Found",404);
        }
        else if($report->status == 'done')
        {
            return $this->error(['report' => ['report is already marked as done']],"Invalid Attempt",401);
        }
        return $this->data(compact('report'));
    }

    public function getAllReportsByField(string $field)
    {
        if($field == 'emergency')
        {
            $reports = Report::where('type', 'fire')->get();
            return $this->data(compact('reports'));
        }
        else
        {
            return $this->error(['report' => ['No reports found']],"Not Found",404);
        }
    }
    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    // /**
    //  * Store a newly created resource in storage.
    //  */
    public function store(StoreReportRequest $request)
    {
        if($request->user('sanctum')->email_verified_at == null)
        {
            return $this->error(['report' => ['your email is not verified']],"unauthenticated",401);
        }
        $imageName = HasMedia::upload($request->file('image'),public_path('images\reports'));
        $data = $request->except('image');
        $data['image'] = $imageName;
        Report::create($data);
        return $this->success("Report Created Successfully",201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $report = report::findOrFail($id);
        return $this->data(compact('report'));
    }

    public function showByUserId(string $id)
    {
        $reports = Report::where('user_id', $id)->get();

        if (!$reports) {
            return $this->error(['report' => ['No reports found by the existed id']],"Not Found",404);
        }

        return $this->data(compact('reports'));
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = report::findOrFail($id)->only(['status','gov_user_id', 'admin_id']); // select
        return $this->data(compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, string $id)
    {
        $report = report::findOrFail($id); // select
        $data = $request->only(['status','gov_user_id', 'admin_id']);

        $report->update($data);
        // update data into db
         return $this->success("Report Updated Successfully",201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        $report = Report::findOrFail($id); // select
        $imageName = explode("/",$report->image)[5];
        HasMedia::delete(public_path("images\\reports\\{$imageName}"));
        $report->delete();
        return $this->success("Report Deleted Successfully",201);
    }
}
