<?php

namespace App\Controller\Admin;


use App\Entity\Article;
use App\Entity\Enchere;
use App\Entity\Category;
use App\Entity\Fermeture;
use App\Entity\Reduction;
use App\Entity\Proposition;
use App\Entity\Augmentation;
use App\Entity\DemandeDevis;
use App\Entity\Document;
use App\Entity\EnchereInverse;
use App\Entity\GeneralDocs;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

class DashboardController extends AbstractDashboardController
{
    /**
     * @Route("/admin", name="admin")
     */
    public function index(): Response
    {
        $routeBuilder = $this->get(AdminUrlGenerator::class);

        return $this->redirect($routeBuilder->setController(UserCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Marketplace D Enchere Pfe')
            ->setTranslationDomain('my-custom-domain')
            ->setTextDirection('ltr')
            ->renderContentMaximized()
            ->renderSidebarMinimized()
            ->disableUrlSignatures()
            ->generateRelativeUrls();
    }

    public function configureMenuItems(): iterable
    {
        return [
            MenuItem::linkToDashboard('Dashboard', 'fa fa-home'),

            MenuItem::section('User'),
            MenuItem::linkToCrud('User', 'fa fa-user', User::class),

            MenuItem::section('Article'),
            MenuItem::linkToCrud('Articles', 'fa fa-box', Article::class),

            MenuItem::section('Category'),
            MenuItem::linkToCrud('Categories', 'fa fa-table', Category::class),
            
            MenuItem::section('GeneralDocs'),
            MenuItem::linkToCrud('GeneralDocs', 'fa fa-image', GeneralDocs::class),


            MenuItem::section('Documents'),
            MenuItem::linkToCrud('Documents', 'fa fa-tags', Document::class),

            MenuItem::section('Enchere'),
            MenuItem::linkToCrud('Encheres', 'fa fa-tags', Enchere::class),

            MenuItem::section('Augmentation'),
            MenuItem::linkToCrud('Augmentations', 'fa fa-plus', Augmentation::class),

            MenuItem::section('EnchereInverse'),
            MenuItem::linkToCrud('EnchereInverses', 'fa fa-store', EnchereInverse::class),

            MenuItem::section('Reduction'),
            MenuItem::linkToCrud('Reductions', 'fa fa-minus', Reduction::class),

            MenuItem::section('Fermeture'),
            MenuItem::linkToCrud('Fermetures', 'fa fa-door-closed', Fermeture::class),

            MenuItem::section('DemandeDevis'),
            MenuItem::linkToCrud('DemandeDeviss', 'fa fa-newspaper', DemandeDevis::class),

            MenuItem::section('Proposition'),
            MenuItem::linkToCrud('Propositions', 'fa fa-reply', Proposition::class),
        ];

        // yield MenuItem::linkToCrud('The Label', 'fas fa-list', EntityClass::class);
    }
}
