<?php

namespace App\Repository;

use App\Entity\Surveille;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Surveille|null find($id, $lockMode = null, $lockVersion = null)
 * @method Surveille|null findOneBy(array $criteria, array $orderBy = null)
 * @method Surveille[]    findAll()
 * @method Surveille[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SurveilleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Surveille::class);
    }

    // /**
    //  * @return Surveille[] Returns an array of Surveille objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Surveille
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
