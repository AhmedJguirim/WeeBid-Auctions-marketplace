<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST', 'GET'])]
    public function login(Request $request)
    {
        $user = $this->getUser();
        return $this->json([
            'username' => $user->getUserIdentifier(),
            'roles' =>$user->getRoles(),
        ]);
    }
    #[Route('/api/logout', name: 'api_logout', methods: ['POST', 'GET'])]
    public function logout(){
        return $this->json([
            'response' => "success"
        ]);
    }
}
