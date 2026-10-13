<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\PropositionRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PropositionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:proposition:collection']],
    denormalizationContext: ['groups' => ['write:proposition']],
    collectionOperations:[
        "propositionTable"=>[
            "path" => "/propositionsTable",
            'method' => "GET",
            "pagination_items_per_page" => 15,
        ],
        "get",
        "post"
    ],
    itemOperations: [
        'delete',
        'get' => [
            'normalisation_context' => ['groups' => ['read:proposition:collection']]
        ]
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['date' => 'DESC'])]
#[ApiFilter(SearchFilter::class, properties: ['transmittedTo' => 'exact'])]
class Proposition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:proposition:collection'])]
    private $id;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'propositionsTransmises')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:proposition', 'read:proposition:collection'])]
    private $transmitter;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'propositionsRecu')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:proposition', 'read:proposition:collection'])]
    private $transmittedTo;

    #[ORM\ManyToOne(targetEntity: Enchere::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['write:proposition', 'read:proposition:collection'])]
    private $enchere;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:proposition:collection'])]
    private $date;

    public function __construct()
    {
        $this->date = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTransmitter(): ?User
    {
        return $this->transmitter;
    }

    public function setTransmitter(?User $transmitter): self
    {
        $this->transmitter = $transmitter;

        return $this;
    }

    public function getTransmittedTo(): ?User
    {
        return $this->transmittedTo;
    }

    public function setTransmittedTo(?user $transmittedTo): self
    {
        $this->transmittedTo = $transmittedTo;

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

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }
}
