<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\AdresseRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AdresseRepository::class)]
#[ApiResource(
denormalizationContext: ['groups' => ['write:article']],
itemOperations: [
    'put'=> ["access_control" => "is_granted('EDIT', previous_object)",],
    'get',
    'delete'=> ["access_control" => "is_granted('EDIT', previous_object)",],
]
)]
class Adresse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:user:collection', 'write:article'])]
    private $id;
    
    
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:user:collection', 'write:article', 
    'read:enchere:collection', 'read:enchereInverse:collection'])]
    private $pays;

    
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:user:collection', 'write:article',
     'read:enchere:collection', 'read:enchereInverse:collection'])]
    private $ville;

    
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:user:item', 'write:article'])]
    private $rue;

    
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:user:item', 'write:article'])]
    //TODO: add valid regex
    // #[Assert\Regex(
    //     pattern: "^\d{5}(?:[-\s]\d{4})?$",
    //     message: "zipcode invalide"
    // )]
    
    private $zipcode;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'adresse')]
    #[Groups(['write:article'])]
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): self
    {
        $this->pays = $pays;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville): self
    {
        $this->ville = $ville;

        return $this;
    }

    public function getRue(): ?string
    {
        return $this->rue;
    }

    public function setRue(string $rue): self
    {
        $this->rue = $rue;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): self
    {
        $this->zipcode = $zipcode;

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
}
