<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\DemandeDevisRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DemandeDevisRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:demandeDevis:collection']],
    denormalizationContext: ['groups' => ['write:demandeDevis']],
    collectionOperations: [
        "demandesTable"=>[
            "path" => "/demandesTable",
            'method' => "GET",
            "pagination_items_per_page" => 15,
        ],
        "get",
        "post"
    ],
    itemOperations: [
       
        'delete',
        'put',
        'get' => [
            'normalisation_context' => ['groups' => ['read:demandeDevis:collection', 'read:demandeDevis:item']]
        ]
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['date' => 'DESC'])]
#[ApiFilter(SearchFilter::class, properties: ['transmittedTo' => 'exact'])]
class DemandeDevis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:demandeDevis:collection'])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['write:demandeDevis', 'read:demandeDevis:collection'])]
    private $descriptionArticle;

    #[ORM\Column(type: 'integer')]
    #[Groups(['write:demandeDevis', 'read:demandeDevis:collection'])]
    #[Assert\Positive]
    private $quantity;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'demandeDevisTransmis')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:demandeDevis', 'read:demandeDevis:collection'])]
    private $transmitter;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'demandesRecus')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:demandeDevis', 'read:demandeDevis:collection'])]
    private $transmittedTo;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:demandeDevis:collection'])]
    private $date;

    public function __construct()
    {
        $this->date = new DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescriptionArticle(): ?string
    {
        return $this->descriptionArticle;
    }

    public function setDescriptionArticle(string $descriptionArticle): self
    {
        $this->descriptionArticle = $descriptionArticle;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
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

    public function setTransmittedTo(?User $transmittedTo): self
    {
        $this->transmittedTo = $transmittedTo;

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
