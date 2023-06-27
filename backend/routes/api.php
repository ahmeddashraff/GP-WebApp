<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\RegisterController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\User\Auth\LoginController as UserLoginController;
use App\Http\Controllers\User\Auth\RegisterController as UserRegisterController;
use App\Http\Controllers\GovernmentUser\Auth\LoginController as GovernmentUserLoginController;
use App\Http\Controllers\GovernmentUser\Auth\RegisterController as GovernmentUserRegisterController;
use App\Http\Controllers\User\Auth\VerificationController;
use App\Http\Controllers\UserController;

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
    Route::post('login',[GovernmentUserLoginController::class,'login']);
    Route::post('register',GovernmentUserRegisterController::class);
    Route::middleware('auth:sanctum')->group(function(){
        Route::prefix('reports')->controller(ReportController::class)->group(function(){
            Route::get('/getAllReportsByField/{field}','getAllReportsByField');
            Route::get('/markReportAsDone/{id}','markReportAsDone');

        });
    });

});

Route::prefix('admins')->group(function(){
    Route::post('register',RegisterController::class);
    Route::post('login',[LoginController::class,'login']);
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
        Route::get('/getAllAdminsInDepartment/{location}',[AdminController::class,'getAllAdminsInDepartment']);
        Route::put('/updateAdminStatus/{id}',[AdminController::class,'updateAdminStatus']);
        Route::put('/updateAdminInfo/{id}',[AdminController::class,'updateAdminInfo']);
        Route::delete('/delete/{id}',[AdminController::class,'delete']);
        Route::get('statistics',StatisticsController::class);
        Route::post('logout-current',[LoginController::class,'logoutCurrent']);
    });
});

Route::prefix('users')->group(function(){
    Route::prefix('auth')->group(function(){
        Route::post('register',UserRegisterController::class);
        Route::post('login',[UserLoginController::class,'login']);
        Route::prefix('code')->group(function(){
            Route::post('send', [VerificationController::class,'send']);
            Route::post('verify', [VerificationController::class,'verify']);
        });
        Route::middleware('auth:sanctum')->group(function(){
            Route::post('logout-current',[UserLoginController::class,'logoutCurrent']);
            // Route::get('profile',ProfileController::class);
        });
    });
    Route::prefix('reports')->group(function(){
        Route::middleware('auth:sanctum')->group(function(){
            Route::post('store',[ReportController::class,'store']);
    });

    });
});
