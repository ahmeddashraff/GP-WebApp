<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GovernmentUserController;
use App\Http\Controllers\User\Auth\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::prefix('GovUsers')->group(function(){
    Route::post('login',[GovernmentUserController::class,'login']);
    Route::middleware('auth:sanctum')->group(function(){
        Route::prefix('reports')->controller(ReportController::class)->group(function(){
            Route::get('/getAllReportsByField/{field}','getAllReportsByField');
            Route::get('/markReportAsDone/{id}','markReportAsDone');
        });
    });

});

Route::prefix('admins')->group(function(){
    Route::post('login',[AdminController::class,'login']);
    Route::middleware('auth:sanctum')->group(function(){
        Route::prefix('reports')->controller(ReportController::class)->group(function(){
            Route::get('/','index');
            Route::get('/show/{id}','show');
            Route::get('/getUserReports/{id}','showByUserId');
            Route::get('/edit/{id}','edit');
            Route::put('/update/{id}','update');
            Route::delete('/delete/{id}','delete');
        });
        Route::prefix('users')->controller(UserController::class)->group(function(){
            Route::get('/','index');
            Route::get('/show/{id}','show');
            Route::post('/restrict/{id}','restrict');
            Route::post('/unrestrict/{id}','unrestrict');
            Route::post('/ban/{id}','ban');
            Route::post('/unban/{id}','unban');
        });
        Route::prefix('GovUsers')->controller(GovernmentUserController::class)->group(function(){
            Route::post('/addGovernmentUser','addGovernmentUser');
            Route::get('/getAllGovernmentUsersInDepartment/{location}','getAllGovernmentUsersInDepartment');
            Route::put('/updateGovernmentUserStatus/{id}','updateGovernmentUserStatus');
            Route::put('/updateGovernmentUserInfo/{id}','updateGovernmentUserInfo');
            Route::delete('/delete/{id}','delete');
        });
        Route::get('/getAllAdminsInDepartment/{location}',[AdminController::class,'getAllAdminsInDepartment']);
        Route::put('/updateAdminStatus/{id}',[AdminController::class,'updateAdminStatus']);
        Route::put('/updateAdminInfo/{id}',[AdminController::class,'updateAdminInfo']);
        Route::post('/addAdmin',[AdminController::class,'addAdmin']);
        Route::delete('/delete/{id}',[AdminController::class,'delete']);
        Route::get('/getStats',[AdminController::class,'getStats']);
        Route::post('logout-current',[AdminController::class,'logoutCurrent']);
    });
});

Route::prefix('users')->group(function(){
        Route::prefix('auth')->group(function(){
            Route::post('register',[UserController::class,'register']);
            Route::post('login',[UserController::class,'login']);
            Route::prefix('code')->group(function(){
                Route::post('send', [VerificationController::class,'send']);
                Route::post('verify', [VerificationController::class,'verify']);
            });
        });

        Route::middleware('auth:sanctum')->group(function(){
            Route::prefix('reports')->group(function(){
                Route::middleware('auth:sanctum')->group(function(){
                    Route::post('/store',[ReportController::class,'store']);
                    Route::get('/showByUserId/{id}',[ReportController::class,'showByUserId']);
            });
            Route::post('logout-current',[UserController::class,'logoutCurrent']);
        });
    });
});
