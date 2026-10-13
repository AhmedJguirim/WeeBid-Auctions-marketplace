<?php

namespace App\Controller;

use App\Repository\EnchereRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Augmenter extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager,private EnchereRepository $repo)
    {
        
    }
    public function __invoke($data)
    {
        try {
            $this->entityManager->persist($data);
        $this->entityManager->flush();
        $enchere = $this->repo->find($data->getEnchere());
        $enchere->setCurrentPrice($data->getValue());
        $this->entityManager->persist($enchere);
        $this->entityManager->flush();
        return $data;
        } catch (\Throwable $th) {
            return $th;
        }
        
    }
}
