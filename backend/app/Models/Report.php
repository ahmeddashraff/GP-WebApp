<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Report extends Model
{
    use HasFactory;
    protected $fillable = ['description','status',
    'image','severity','user_id','admin_id','gov_user_id','type'];

    protected function image(): Attribute
    {
        return Attribute::make(
            get: function($value){
                return asset('images/reports/'.$value);
            },
        );
    }
}
