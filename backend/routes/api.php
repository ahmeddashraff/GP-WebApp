<?php

use App\Http\Controllers\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Auth\RegisterController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\User\Auth\LoginController as UserLoginController;
use App\Http\Controllers\User\Auth\RegisterController as UserRegisterController;
use App\Http\Controllers\User\Auth\VerificationController;

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


Route::prefix('reports')->controller(ReportController::class)->group(function(){
    Route::get('/','index');
    Route::get('/show/{id}','show');
    // Route::post('/store','store');
    Route::get('/edit/{id}','edit');
    Route::put('/update/{id}','update');
    Route::delete('/delete/{id}','delete');
});


Route::prefix('admins')->group(function(){
    Route::post('register',RegisterController::class);
    Route::post('login',[LoginController::class,'login']);
    // Route::middleware('auth:sanctum')->group(function(){
    //     Route::post('logout-all',[LoginController::class,'logoutAll']);
    //     Route::post('logout-current',[LoginController::class,'logoutCurrent']);
    //     Route::post('logout-other',[LoginController::class,'logoutOther']);
    //     Route::get('profile',ProfileController::class);
    // });
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
            Route::post('logout-all',[LoginController::class,'logoutAll']);
            Route::post('logout-current',[LoginController::class,'logoutCurrent']);
            Route::post('logout-other',[LoginController::class,'logoutOther']);
            // Route::get('profile',ProfileController::class);
        });
    });

    Route::prefix('reports')->group(function(){
        Route::post('create',[ReportController::class,'create']);
    });
});
