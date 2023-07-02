<?php
namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class HasMedia {
    public static function upload($decodedImageData,$path)
    {
        $f = finfo_open();
        $imageType = finfo_buffer($f, $decodedImageData, FILEINFO_MIME_TYPE);
        finfo_close($f);
        // Generate a unique file name
        $imageName = uniqid() . '.' . (new self)->getImageExtension($imageType);
        $imagePath = $path. "\\" . $imageName;

        // Save the decoded image data to disk
        File::put($imagePath, $decodedImageData);
        return $imageName;
    }

    public static function delete($path)
    {
        if(file_exists($path)){
            unlink($path);
            return true;
        }
        return false;
    }
    private function getImageExtension($imageType)
    {
        $extensions = [
            'image/jpeg' => 'jpeg',
            'image/png' => 'png',
            'image/jpg' => 'jpg',
            // Add more supported image types and their corresponding extensions here
        ];

        return $extensions[$imageType] ?? 'jpg'; // Default to JPG if the image type is unknown or unsupported
    }
}
