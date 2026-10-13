<?php

namespace App\Controller\Admin;

use App\Entity\Reduction;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class ReductionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Reduction::class;
    }
    public function configureActions(Actions $actions): Actions
    {
        return $actions
        // ...
        ->disable(Action::NEW, Action::EDIT)
    ;
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
