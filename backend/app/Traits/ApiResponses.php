<?php
namespace App\Traits;

trait ApiResponses {
    public function success(string $message ,int $statusCode = 200)
    {
        return response()->json([
            "success"=>true,
            "message"=>$message,
            "data"=>(object)[],
            "errors"=>(object)[]
        ],$statusCode);
    }

    public function error(array $errors , string $message = "" ,int $statusCode = 422)
    {
        return response()->json([
            "success"=>false,
            "message"=>$message,
            "data"=>(object)[],
            "errors"=>(object)$errors
        ],$statusCode);
    }

    public function data(array $data , string $message = "" ,int $statusCode = 200)
    {
        return response()->json([
            "success"=>true,
            "message"=>$message,
            "data"=>(object)$data,
            "errors"=>(object)[]
        ],$statusCode);
    }
}
