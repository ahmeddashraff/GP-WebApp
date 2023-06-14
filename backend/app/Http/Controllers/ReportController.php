<?php

namespace App\Http\Controllers;

use App\Http\Requests\Reports\StoreReportRequest;
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
    // public function store(StoreReportRequest $request)
    // {
    //     $imageName = HasMedia::upload($request->file('image'),public_path('images\reports'));
    //     $data = $request->except('image');
    //     $data['image'] = $imageName;
    //     Report::create($data);
    //     return $this->success("Report Created Successfully",201);    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $report = report::findOrFail($id);
        return $this->data(compact('report'));
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
