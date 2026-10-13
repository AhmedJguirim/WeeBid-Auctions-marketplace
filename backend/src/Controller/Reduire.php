<?php

namespace App\Controller;


use Doctrine\ORM\EntityManagerInterface;
use App\Repository\EnchereInverseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Reduire extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager,private EnchereInverseRepository $repo)
    {
        
    }
    public function __invoke($data)
    {
        try {
            $this->entityManager->persist($data);
        $this->entityManager->flush();
        $enchere = $this->repo->find($data->getEnchereInverse());
        $enchere->setCurrentPrice($data->getValue());
        $this->entityManager->persist($enchere);
        $this->entityManager->flush();
        return $data;
        } catch (\Throwable $th) {
            return $th;
        }
        
    }
}
