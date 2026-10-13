<?php

namespace App\Controller\Admin;

use App\Entity\GeneralDocs;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use Vich\UploaderBundle\Form\Type\VichImageType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class GeneralDocsCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return GeneralDocs::class;
        
    }

    
    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->setFormTypeOption('disabled','disabled');
        yield TextField::new('filePath')->setFormTypeOption('disabled','disabled');
        
        yield TextareaField::new('file')->setFormType(VichImageType::class);
    }
    public function configureActions(Actions $actions): Actions
    {
        return $actions
        // ...
        ->disable(Action::NEW, Action::DELETE)

    ;
    }
    
}
