<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class UserCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        yield TextField::new('email')->setFormTypeOption('disabled','disabled');
        // yield TextField::new('image')->setFormTypeOption('disabled','disabled');
        yield BooleanField::new('isActive');
        // yield TextareaField::new('file')->setFormType(VichImageType::class);
    }
    public function configureActions(Actions $actions): Actions
    {
        return $actions
        // ...
        ->disable(Action::NEW, Action::DELETE)
        ->disable(Action::NEW, Action::NEW)
    ;
    }
    
}
