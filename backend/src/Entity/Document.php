<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\DocumentRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Controller\CreateMediaObjectAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 * @Vich\Uploadable
 */
#[ORM\Entity(repositoryClass: DocumentRepository::class)]
#[ApiResource(
    iri: 'http://schema.org/MediaObject',
    itemOperations: [
        'get'
    ],
    collectionOperations: [
        'get',
        'post' => [
            "security" => "is_granted('ROLE_USER')",
            'controller' => CreateMediaObjectAction::class,
            'deserialize' => false,
            'validation_groups' => ['Default', 'document:write'],
            'openapi_context' => [
                'requestBody' => [
                    'content' => [
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                    'article' => [
                                        'type' => "string",
                                    ]
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]
),ApiFilter(
    SearchFilter::class ,
    properties: ['article' => 'exact',]
)]
class Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['read:vente:item', 'read:document','read:enchere:item', 'read:enchereInverse:item'])]
    private $id;


    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['media_object:read','read:surveille:collection','read:enchere:collection','read:enchereInverse:collection'])]
    public ?string $contentUrl = null;

    #[ORM\Column(nullable: true)] 
    #[Groups(['media_object:read','read:surveille:collection','read:enchere:collection','read:enchereInverse:collection'])]
    public ?string $filePath = null;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'documents')]
    private $article;

    /**
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="filePath")
     */
    public ?File $file = null;
    
    
    public function getId(): ?int
    {
        return $this->id;
    }


    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): self
    {
        $this->article = $article;

        return $this;
    }
    
    public function getFile()
    {
        return $this->file;
    }

    public function setFile($file): self
    {
        $this->file = $file;

        return $this;
    }
}