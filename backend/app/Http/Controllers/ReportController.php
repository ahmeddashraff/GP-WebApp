<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreReportRequest;
use App\Http\Requests\Admin\Reports\UpdateReportRequest;
use App\Http\Requests\Reports\UpdateReportStatusRequest;
use App\Models\Incident;
use App\Models\Report;
use App\Models\User;
use App\Services\HasMedia;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;


class ReportController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $department_loc = $request->user("sanctum")->department_loc;
        $reports = Report::join('incidents', 'reports.id', '=', 'incidents.report_id')->where('reports.location', $department_loc)->get();
        if(!$reports)
        {
            return $this->error(['report' =>'No reports found'],"Not Found",404);
        }
        return $this->data(compact('reports'));
    }

    public function updateStatus(UpdateReportStatusRequest $request,int $id)
    {


        // Find the admin by ID
        $report = Report::find($id);
        if(!$report){
            return $this->error(['report' =>"report not found"],"Not Found",404);
        }

        // Update the report status
        $report->status = $request->status;
        $report->update();

        $reportsCount = Report::whereIn("status", [0,1])->where('user_id', $report->user_id)->count();
        $countFives = (int)floor($reportsCount / 5) * 5;
        $points =   2 * $countFives;

        $user = User::findOrFail($report->user_id);

        if($request->status==3)
        {
            if($request->is_fake)
            {
                $user->number_of_fake_reports++;
            }
        }

        $user->points = $points;
        $user->update();

        return $this->success("Report status is changed successfully",200);
    }

    public function getAllReportsByField(Request $request)
    {
        $field = $request->user("sanctum")->field;
        if($field == 'civil_defense')
        {
            $reports = Report::where('type', 'fire')->where("location",$request->user("sanctum")->department_loc )->get();
            return $this->data(compact('reports'));
        }
        else if($field == 'local_municipality')
        {
            $types = ['fallen tree', 'pothole', 'flooding'];
            $reports = Report::whereIn('type', $types)->where("location",$request->user("sanctum")->department_loc )->get();
            return $this->data(compact('reports'));
        }
        else
        {
            return $this->error(['report' =>'No reports found'],"Not Found",404);
        }
    }

    public function store(StoreReportRequest $request)
    {

        if($request->user('sanctum')->email_verified_at == null)
        {
            return $this->error(['report' =>'your email is not verified'],"unauthenticated",401);
        }

        $base64Image = $request->image;
        $decodedImageData = base64_decode($base64Image);



        $imageName = HasMedia::upload($decodedImageData,public_path('images\reports'));

        $status = 2;
        if($request->confusion == 'true')
        {
            $status = 4;
        }

        $report = Report::create([
            'description'=>$request->description,
            'severity'=>$request->severity,
            'type'=>$request->type,
            'location'=>$request->location,
            'image'=>$imageName,
            'user_id'=>$request->user('sanctum')->id,
            'status'=>$status
        ]);

        Incident::create([
            'type'=>$request->type,
            'location'=>$request->location,
            'longitude'=>$request->longitude,
            'latitude'=>$request->latitude,
            'report_id'=>$report->id
        ]);
        return $this->success("Report Created Successfully",201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $report = report::find($id);
        if(!$report){
            return $this->error(['report' =>"report not found"],"Not Found",404);
        }
        return $this->data(compact('report'));
    }

    public function showByUserId(int $id)
    {
        $reports = Report::join('incidents', 'reports.id', '=', 'incidents.report_id')
        ->where('reports.user_id', $id)
        ->get();

        if (!$reports) {
            return $this->error(['report' => 'No reports found by the existed id'],"Not Found",404);
        }

        return $this->data(compact('reports'));
    }

    public function getUserReports(Request $request)
    {
        $userId = $request->user("sanctum")->id;
        $reports = Report::where('user_id', $userId)->get();
        return $this->data(compact('reports'));
    }

    public function updateReportType(Request $request,int $id)
    {
        $report = report::find($id);
        if(!$report){
            return $this->error(['report' =>"report not found"],"Not Found",404);
        }

        $report->type = $request->type;
        $report->status = 2;
        $report->update();
        return $this->success("Report Updated Successfully",200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(int $id)
    {
        $report = Report::find($id);
        if(!$report){
            return $this->error(['report' => "report not found"],"Not Found",404);
        }
        $imageName = explode("/",$report->image)[5];
        HasMedia::delete(public_path("images\\reports\\{$imageName}"));
        $report->delete();
        return $this->success("Report Deleted Successfully",200);
    }
}
