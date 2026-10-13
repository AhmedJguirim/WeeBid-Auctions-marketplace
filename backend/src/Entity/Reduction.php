<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ReductionRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Controller\Reduire;

#[ORM\Entity(repositoryClass: ReductionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:reduction:collection']],
    paginationItemsPerPage:5 ,
    denormalizationContext: ['groups' => ['write:reduction']],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_USER')"],
        "getLowest"=>[
            "path" => "/reductionLowest",
            'method' => "GET",
            "pagination_items_per_page" => 1,
        ],
        "reductionsTable"=>[
            "path" => "/reductionsTable",
            'method' => "GET",
            "pagination_items_per_page" => 15,
        ],
        "getPages"=>[
            'path' => '/reductions/pages',
            'method' => 'GET',
            "pagination_enabled" => false,
            'normalization_context' => ['groups' => ['pages']]
        ],
        "augmenter"=>[
            "path" => "/reduire",
            'method' => "POST",
            'controller' => Reduire::class,
            'normalization_context' => ['groups' => 'write:reduction'],
            'read' => false,
        ],
    ],
    itemOperations: [
        'delete',
        'get' => [
            'normalisation_context' => ['groups' => ['read:reduction:collection']]
        ]
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['date' => 'DESC'])]
#[ApiFilter(SearchFilter::class, properties: ['enchere' => 'exact', 'user' => 'exact','enchereInverse' => 'exact'])]
class Reduction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:reduction:collection','pages'])]
    private $id;

    #[ORM\Column(type: 'float')]
    #[Groups(['write:reduction', 'read:reduction:collection'])]
    #[Assert\Positive]
    private $value;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:reduction:collection'])]
    private $date;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'reductions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:reduction','read:reduction:collection'])]
    private $user;

    #[ORM\ManyToOne(targetEntity: EnchereInverse::class, inversedBy: 'reductions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:reduction','read:reduction:collection'])]
    private $enchereInverse;

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

    public function getEnchereInverse(): ?EnchereInverse
    {
        return $this->enchereInverse;
    }

    public function setEnchereInverse(?EnchereInverse $enchereInverse): self
    {
        $this->enchereInverse = $enchereInverse;

        return $this;
    }
}
