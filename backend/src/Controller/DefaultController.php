<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class DefaultController extends AbstractController
{
    // #[Route('/', name: 'default')]
    // public function index(): Response
    // {
    //     return $this->render('default/index.html.twig', [
    //         'controller_name' => 'DefaultController',
    //     ]);
    // }

    // #[Route('/hash', name:'hasher')]
    // public function hash(UserPasswordHasherInterface $hasher): Response
    // {
    //     $user = new User();
    //     $testPassword= "0000";
    //     $hashedPassword = $hasher->hashPassword($user,$testPassword);
    //     dd($hashedPassword);

    //     return $this->render('default/index.html.twig', [
    //         'controller_name' => 'DefaultController',
    //     ]);
    // }
    

}
