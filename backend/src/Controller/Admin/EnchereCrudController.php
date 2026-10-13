<?php

namespace App\Controller\Admin;

use App\Entity\Enchere;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class EnchereCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Enchere::class;
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
