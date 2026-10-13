<?php
// api/src/Controller/CreateMediaObjectAction.php

namespace App\Controller;

use App\Entity\Document;
use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __construct(private ArticleRepository $rep)
    {
        
    }
    public function __invoke(Request $request): Document
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $mediaObject = new Document();
        $mediaObject->file = $uploadedFile;
        $articleId = $request->get('article');
        $article = $this->rep->find($articleId);
        $mediaObject->setArticle($article);

        return $mediaObject;
    }
}