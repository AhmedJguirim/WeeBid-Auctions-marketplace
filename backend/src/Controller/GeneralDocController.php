<?php

namespace App\Controller;

use App\Entity\GeneralDocs;
use App\Service\SafeImageUpload;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
final class GeneralDocController extends AbstractController
{
    public function __construct(private SafeImageUpload $images)
    {
    }

    public function __invoke(Request $request): GeneralDocs
    {
        $mediaObject = new GeneralDocs();
        $mediaObject->file = $this->images->sanitize($request->files->get('file'));

        return $mediaObject;
    }
}
