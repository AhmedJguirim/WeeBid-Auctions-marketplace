<?php

namespace App\Controller;

use App\Repository\EnchereInverseRepository;
use App\Repository\EnchereRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Counting extends AbstractController
{
    public function __construct(private EnchereRepository $er, private EnchereInverseRepository $eir,private UserRepository $ur)
    {
        
    }
    public function __invoke()
    {
        $totalEnchere = $this->er->createQueryBuilder('a')
            ->select('count(a.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $totalEnchereInverses = $this->eir->createQueryBuilder('a')
            ->select('count(a.id)')
            ->getQuery()
            ->getSingleScalarResult();

        $totalUser = $this->ur->createQueryBuilder('a')
            ->select('count(a.id)')
            ->getQuery()
            ->getSingleScalarResult();



        return ["encheres"=>$totalEnchere,"encheresInverses"=>$totalEnchereInverses, 'user'=>$totalUser];
    }
}
