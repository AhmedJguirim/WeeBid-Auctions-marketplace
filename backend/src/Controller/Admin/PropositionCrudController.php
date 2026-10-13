<?php

namespace App\Controller\Admin;

use App\Entity\Proposition;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class PropositionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Proposition::class;
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
