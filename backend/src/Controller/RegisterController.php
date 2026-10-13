<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;

#[asController]
class RegisterController extends AbstractController
{
    private $entityManager;
    private $validator;
    public function __construct(EntityManagerInterface $entityManager,private UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
    }
    public function __invoke($data)
    {
        //just replacing the plainPassword with a hashed version 
        try {
            $plainPassword = $data->getPassword();
        $hashedPassword = $this->passwordHasher->hashPassword(
            $data,
            $plainPassword
        );
        $data->setPassword($hashedPassword);
        $this->entityManager->persist($data);
        $this->entityManager->flush();
        //look for RecursiveContextualValidator.php in validator folder in vendor/symfony and change the error message in line 164 to "not an error" exactly like that
        return json_encode($data);
        } catch (\Throwable $th) {
            throw $th;
        }
        
    }
}