<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\SurveilleRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\SurveilleCountController;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

#[ORM\Entity(repositoryClass: SurveilleRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:surveille:collection']],
    denormalizationContext: ['groups' => ['write:surveille']],
    collectionOperations:[
        'get',
        'post'=>["security_post_denormalize" => "is_granted('POST', object)",],

    ],
    itemOperations: [
        'delete'=>["access_control" => "is_granted('EDIT', previous_object)",],
        'get' => [
            'normalisation_context' => ['groups' => ['read:surveille:collection']]
        ]
    ]
        ),ApiFilter(
    SearchFilter::class ,
    properties: ['user' => 'exact', 'enchere'=>'exact', 'enchereInverse'=>'exact']
)]
class Surveille
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:surveille:collection','read:user:collection'])]
    private $id;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'surveilles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['write:surveille','read:surveille:collection'])]
    private $user;

    #[ORM\ManyToOne(targetEntity: Enchere::class, inversedBy: 'surveilles')]
    #[Groups(['write:surveille', 'read:surveille:collection', 'read:user:collection'])]
    private $enchere;

    #[ORM\ManyToOne(targetEntity: EnchereInverse::class, inversedBy: 'surveilles')]
    #[Groups(['write:surveille', 'read:surveille:collection', 'read:user:collection'])]
    private $enchereInverse;


    public function __construct()
    {
        $this->notifications = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEnchereInverse(): ?EnchereInverse
    {
        return $this->enchereInverse;
    }

    public function setEnchereInverse(?EnchereInverse $enchereInverse): self
    {
        $this->enchereInverse = $enchereInverse;

        return $this;
    }

    /**
     * @return Collection|Notification[]
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

}
