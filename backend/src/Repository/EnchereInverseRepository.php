<?php

namespace App\Repository;

use App\Entity\EnchereInverse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method EnchereInverse|null find($id, $lockMode = null, $lockVersion = null)
 * @method EnchereInverse|null findOneBy(array $criteria, array $orderBy = null)
 * @method EnchereInverse[]    findAll()
 * @method EnchereInverse[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EnchereInverseRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EnchereInverse::class);
    }

    // /**
    //  * @return EnchereInverse[] Returns an array of EnchereInverse objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?EnchereInverse
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
