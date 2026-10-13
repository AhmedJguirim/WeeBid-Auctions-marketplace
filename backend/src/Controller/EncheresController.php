<?php

namespace App\Controller;
use App\Entity\Article;
use App\Entity\Enchere;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


#[asController]
class EncheresController extends AbstractController
{
    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager, private Security $security)
    {
        $this->entityManager = $entityManager;
    }
    public function __invoke($data)
    {
        $this->entityManager->persist($data);
        $this->entityManager->flush();
        return json_encode($data);
    }
}