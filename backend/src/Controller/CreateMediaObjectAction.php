<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Document;
use App\Entity\Enchere;
use App\Entity\EnchereInverse;
use App\Service\SafeImageUpload;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    private const MAX_IMAGES_PER_ARTICLE = 4;

    public function __construct(private EntityManagerInterface $em, private SafeImageUpload $images)
    {
    }

    public function __invoke(Request $request): Document
    {
        $file = $this->images->sanitize($request->files->get('file'));

        $articleId = $request->get('article');
        if (!is_scalar($articleId) || !ctype_digit((string) $articleId)) {
            throw new BadRequestHttpException('"article" is required');
        }
        $article = $this->em->getRepository(Article::class)->find((int) $articleId);
        if (!$article) {
            throw new NotFoundHttpException('Unknown article');
        }

        // pictures are attached while the listing is being created: once an auction/reverse auction
        // uses the article, nobody can add to it any more (articles have no owner field)
        if ($this->em->getRepository(Enchere::class)->findOneBy(['article' => $article])
            || $this->em->getRepository(EnchereInverse::class)->findOneBy(['article' => $article])) {
            throw new AccessDeniedHttpException('This article is already published.');
        }
        if (count($article->getDocuments()) >= self::MAX_IMAGES_PER_ARTICLE) {
            throw new BadRequestHttpException('4 images maximum per article.');
        }

        $mediaObject = new Document();
        $mediaObject->file = $file;
        $mediaObject->setArticle($article);

        return $mediaObject;
    }
}
