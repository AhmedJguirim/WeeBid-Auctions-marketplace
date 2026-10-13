<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Accepts only real, reasonably sized pictures and gives them a safe, random name.
 *
 * Why: uploads end up in a public folder served by Apache. Without these checks anyone with an account
 * could upload a .php file (remote code execution), a huge file (disk) or a "picture bomb" (memory).
 */
class SafeImageUpload
{
    public const MAX_BYTES = 5 * 1024 * 1024;   // keep in sync with upload_max_filesize and nginx
    public const MAX_SIDE = 6000;               // pixels
    public const MAX_PIXELS = 24_000_000;

    private const TYPES = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    public function sanitize(?UploadedFile $file): UploadedFile
    {
        if (!$file instanceof UploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }
        if (!$file->isValid()) {
            throw new BadRequestHttpException('The upload failed: ' . $file->getErrorMessage());
        }
        if ($file->getSize() > self::MAX_BYTES) {
            throw new UnprocessableEntityHttpException('The image is too large (5 MB maximum).');
        }

        $mime = $file->getMimeType(); // detected from the content, not from the client's headers
        if (!isset(self::TYPES[$mime])) {
            throw new UnprocessableEntityHttpException('Only JPEG, PNG, WebP and GIF images are accepted.');
        }

        $info = @getimagesize($file->getPathname());
        if ($info === false) {
            throw new UnprocessableEntityHttpException('This file is not a valid image.');
        }
        [$width, $height] = $info;
        if ($width < 1 || $height < 1 || $width > self::MAX_SIDE || $height > self::MAX_SIDE || $width * $height > self::MAX_PIXELS) {
            throw new UnprocessableEntityHttpException('The image dimensions are too large.');
        }

        // random name + extension matching the real content: the client's file name is never used
        return new UploadedFile($file->getPathname(), bin2hex(random_bytes(10)) . '.' . self::TYPES[$mime], $mime, null, true);
    }
}
