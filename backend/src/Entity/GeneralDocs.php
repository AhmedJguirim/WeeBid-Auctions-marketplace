<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\GeneralDocsRepository;
use ApiPlatform\Core\Annotation\ApiFilter;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\GeneralDocController;

/**
 * @Vich\Uploadable
 */
#[ORM\Entity(repositoryClass: GeneralDocsRepository::class)]
#[ApiResource(
    iri: 'http://schema.org/MediaObject',
    itemOperations: [
        'get'
    ],
    collectionOperations: [
        'get',
        'post' => [
            "security" => "is_granted('ROLE_USER')",
            'controller' => GeneralDocController::class,
            'deserialize' => false,
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
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ]
)]
class GeneralDocs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['read:document','read:enchere:item', 'read:enchereInverse:item'])]
    private $id;


    #[ApiProperty(iri: 'http://schema.org/contentUrl')]
    #[Groups(['media_object:read','read:category:collection','read:user:collection'])]
    public ?string $contentUrl = null;

    #[ORM\Column(nullable: true)] 
    #[Groups(['media_object:read','read:category:collection','read:user:collection'])]
    public ?string $filePath = null;


    /**
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="filePath")
     */
    public ?File $file = null;


    
    
    public function getId(): ?int
    {
        return $this->id;
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