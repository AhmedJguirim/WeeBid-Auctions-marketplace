<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Repository\AugmentationRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\Augmenter;

#[ORM\Entity(repositoryClass: AugmentationRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:augmentation:collection']],
    paginationItemsPerPage:5 ,
    denormalizationContext: ['groups' => ['write:augmentation']],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_USER')"],
        "getHighest"=>[
            "path" => "/augmentationHighest",
            'method' => "GET",
            "pagination_items_per_page" => 1,
        ],
        "augmentationsTable"=>[
            "path" => "/augmentationsTable",
            'method' => "GET",
            "pagination_items_per_page" => 15,
        ],
        "getPages"=>[
            'path' => '/augmentations/pages',
            'method' => 'GET',
            "pagination_enabled" => false,
            'normalization_context' => ['groups' => ['pages']]
        ],
        "augmenter"=>[
            "path" => "/augmenter",
            'method' => "POST",
            'controller' => Augmenter::class,
            'normalization_context' => ['groups' => 'write:augmentation'],
            'read' => false,
        ],
    ],
    itemOperations: [
        'delete',
        'get' => [
            'normalisation_context' => ['groups' => ['read:augmentation:collection']]
        ]
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['date' => 'DESC'])]
#[ApiFilter(SearchFilter::class, properties: ['enchere' => 'exact', 'user' => 'exact'])]
class Augmentation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:augmentation:collection','pages'])]
    private $id;

    #[ORM\Column(type: 'float')]
    #[Groups(['write:augmentation', 'read:augmentation:collection', 'read:fermeture:collection'])]
    #[Assert\Positive]
    private $value;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['write:augmentation', 'read:augmentation:collection'])]
    private $date;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'augmentations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:augmentation','read:augmentation:collection','read:fermeture:collection'])]
    private $user;

    #[ORM\ManyToOne(targetEntity: Enchere::class, inversedBy: 'augmentations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:augmentation','read:augmentation:collection'])]
    private $enchere;

    public function __construct()
    {
        $this->date = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getValue(): ?float
    {
        return $this->value;
    }

    public function setValue(float $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getEnchere(): ?Enchere
    {
        return $this->enchere;
    }

    public function setEnchere(?Enchere $enchere): self
    {
        $this->enchere = $enchere;

        return $this;
    }
}
