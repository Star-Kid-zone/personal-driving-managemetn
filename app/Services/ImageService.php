<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    private function disk(): string
    {
        return config('filesystems.default', 'public');
    }

    /**
     * Upload a file to the configured disk (S3 in production, public in local).
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path     = $folder . '/' . $filename;

        Storage::disk($this->disk())->put($path, file_get_contents($file), 'public');

        return $path;
    }

    /**
     * Delete a file from the configured disk.
     */
    public function delete(?string $path): bool
    {
        if (!$path) return false;
        return Storage::disk($this->disk())->delete($path);
    }

    /**
     * Get the public URL of a stored file.
     */
    public function url(string $path): string
    {
        return Storage::disk($this->disk())->url($path);
    }

    /**
     * Upload from a base64 encoded string.
     */
    public function uploadBase64(string $base64, string $folder = 'uploads', string $extension = 'jpg'): string
    {
        $data     = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64));
        $filename = Str::uuid() . '.' . $extension;
        $path     = $folder . '/' . $filename;

        Storage::disk($this->disk())->put($path, $data, 'public');
        return $path;
    }
}
