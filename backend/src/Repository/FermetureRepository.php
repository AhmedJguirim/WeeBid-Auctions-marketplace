<?php

namespace App\Repository;

use App\Entity\Fermeture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Fermeture|null find($id, $lockMode = null, $lockVersion = null)
 * @method Fermeture|null findOneBy(array $criteria, array $orderBy = null)
 * @method Fermeture[]    findAll()
 * @method Fermeture[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FermetureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Fermeture::class);
    }

    // /**
    //  * @return Fermeture[] Returns an array of Fermeture objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Fermeture
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
