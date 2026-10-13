<?php

namespace App\Controller\Admin;

use App\Entity\DemandeDevis;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class DemandeDevisCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return DemandeDevis::class;
    }

    /*
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id'),
            TextField::new('title'),
            TextEditorField::new('description'),
        ];
    }
    */
}
