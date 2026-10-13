<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\FermetureRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FermetureRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:fermeture:collection']],
    denormalizationContext: ['groups' => ['write:fermeture']],
    collectionOperations:[
        "get",
        'post'=>["security_post_denormalize" => "is_granted('POST', object)",],
    ],
    itemOperations: [
        'delete',
        'get' => [
            'normalisation_context' => ['groups' => ['read:fermeture:collection']]
        ],
        'put'=>["security_post_denormalize" => "is_granted('EDIT', object)",]
    ]
)]
class Fermeture
{

    //TODO WORK ON IT WITH INHERITANCE!!
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:fermeture:collection','read:enchere:collection',"read:enchere:item",'read:enchereInverse:collection'])]
    private $id;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:fermeture:collection'])]
    private $date;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['read:fermeture:collection', 'write:fermeture'])]
    private $isSold;

    #[ORM\Column(type: 'float')]
    #[Groups(['read:fermeture:collection', 'write:fermeture'])]
    #[Assert\Positive]
    private $finalPrice;

    #[ORM\OneToOne(mappedBy: 'fermeture', targetEntity: Enchere::class, cascade: ['persist', 'remove'])]
    #[Groups(['read:fermeture:collection', 'write:fermeture'])]
    private $enchere;

    #[ORM\OneToOne(mappedBy: 'fermeture', targetEntity: EnchereInverse::class, cascade: ['persist', 'remove'])]
    #[Groups(['read:fermeture:collection', 'write:fermeture'])]
    private $enchereInverse;


    public function __construct()
    {
        $this->date= new \DateTime();    
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getIsSold(): ?bool
    {
        return $this->isSold;
    }

    public function setIsSold(bool $isSold): self
    {
        $this->isSold = $isSold;

        return $this;
    }

    public function getFinalPrice(): ?float
    {
        return $this->finalPrice;
    }

    public function setFinalPrice(float $finalPrice): self
    {
        $this->finalPrice = $finalPrice;

        return $this;
    }

    public function getEnchere(): ?Enchere
    {
        return $this->enchere;
    }

    public function setEnchere(?Enchere $enchere): self
    {
        // unset the owning side of the relation if necessary
        if ($enchere === null && $this->enchere !== null) {
            $this->enchere->setFermeture(null);
        }

        // set the owning side of the relation if necessary
        if ($enchere !== null && $enchere->getFermeture() !== $this) {
            $enchere->setFermeture($this);
        }

        $this->enchere = $enchere;

        return $this;
    }

    public function getEnchereInverse(): ?EnchereInverse
    {
        return $this->enchereInverse;
    }

    public function setEnchereInverse(?EnchereInverse $enchereInverse): self
    {
        // unset the owning side of the relation if necessary
        if ($enchereInverse === null && $this->enchereInverse !== null) {
            $this->enchereInverse->setFermeture(null);
        }

        // set the owning side of the relation if necessary
        if ($enchereInverse !== null && $enchereInverse->getFermeture() !== $this) {
            $enchereInverse->setFermeture($this);
        }

        $this->enchereInverse = $enchereInverse;

        return $this;
    }

}
