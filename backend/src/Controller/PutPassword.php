<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PutPassword extends AbstractController
{
    public function __construct(private EntityManagerInterface $entityManager,private UserRepository $repo,private UserPasswordHasherInterface $passwordHasher)
    {
        
    }
    public function __invoke($data , $id)
    {
        $plainPassword = $data->getPassword();
        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $plainPassword
        );
        $user = $this->repo->find($id);
        $user->setPassword($hashedPassword);
        $this->entityManager->persist($user);
        $this->entityManager->flush();
        return $user;
    }
}
