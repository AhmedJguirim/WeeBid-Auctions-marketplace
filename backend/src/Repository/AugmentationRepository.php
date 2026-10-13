<?php

namespace App\Repository;

use App\Entity\Augmentation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Augmentation|null find($id, $lockMode = null, $lockVersion = null)
 * @method Augmentation|null findOneBy(array $criteria, array $orderBy = null)
 * @method Augmentation[]    findAll()
 * @method Augmentation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AugmentationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Augmentation::class);
    }

    // /**
    //  * @return Augmentation[] Returns an array of Augmentation objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Augmentation
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
