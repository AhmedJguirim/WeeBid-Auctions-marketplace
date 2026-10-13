<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\EnchereInverseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


#[ORM\Entity(repositoryClass: EnchereInverseRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:enchereInverse:collection']],
    paginationItemsPerPage:15 ,
    collectionOperations:[
        'getEight'=>[
            'path' => '/enchere_inverses/getEight',
            'method' => 'GET',
            "pagination_items_per_page" => 6,
            'normalisation_context' => ['groups' => ['read:enchereInverse:collection']]
        ],
        'search'=>[
            'path' => '/enchere_inverses/search',
            'method' => 'GET',
            "pagination_items_per_page" => 5,
            'normalisation_context' => ['groups' => ['read:enchereInverse:search']]
        ],
        "getPages"=>[
            'path' => '/enchere_inverses/pages',
            'method' => 'GET',
            "pagination_enabled" => false,
            'normalization_context' => ['groups' => ['pages']]
        ],
        "get",
        'post'=>["security_post_denormalize" => "is_granted('POST', object)",],
    ],

    
    itemOperations: [
        "put_price"=>[
            "path" => "/encheresInverseBid/{id}",
            "method" => "PUT",
            "denormalisation_context" => ['groups'=>["bid"]],
            "security" => "is_granted('ROLE_USER')"
        ],
        'put' => ["access_control" => "is_granted('EDIT', previous_object)",],
        'delete'=> ["access_control" => "is_granted('EDIT', previous_object)",],
        'get' => [
            'normalisation_context' => ['groups' => ['read:enchereInverse:collection', 'read:enchereInverse:item',]]
        ],
        
    ]
        ),
        ApiFilter(
    SearchFilter::class ,
    properties: ['user' => 'exact', 'category' => 'exact','id' => 'exact', 'article.name' => 'partial']
)]
#[ApiFilter(OrderFilter::class, properties: ['endDate'=>'ASC'])]
#[ApiFilter(DateFilter::class, properties: ['startDate','endDate'])]
class EnchereInverse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:surveille:collection', 'read:fermeture:collection','read:enchereInverse:collection','pages'])]
    private $id;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:enchereInverse:collection','write:enchereInverse','read:enchereInverse:search'])]
    #[Assert\Positive]
    private $quantity;

    #[ORM\Column(type: 'float')]
    #[Groups(['read:enchereInverse:collection','write:enchereInverse'])]
    #[Assert\Positive]
    private $initPrice;

    #[ORM\Column(type: 'float')]
    #[Assert\Positive]
    private $immediatePrice;

    #[ORM\Column(type: 'float')]
    #[Groups(['read:enchereInverse:collection','bid','write:enchereInverse','read:surveille:collection','read:enchereInverse:search'])]
    #[Assert\Positive]
    private $currentPrice;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:enchereInverse:collection', 'write:enchereInverse'])]
    private $startDate;


    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:surveille:collection','read:enchereInverse:collection', 'write:enchereInverse'])]
    #[Assert\GreaterThan('today')]
    private $endDate;

    #[ORM\OneToOne(targetEntity: Article::class, cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:enchereInverse:collection', 'read:surveille:collection', 'read:fermeture:collection', 'read:enchereInverse:search'])]
    private $article;

    #[ORM\OneToMany(mappedBy: 'enchereInverse', targetEntity: Surveille::class, orphanRemoval: true)]
    private $surveilles;

    #[ORM\OneToMany(mappedBy: 'enchereInverse', targetEntity: Reduction::class, orphanRemoval: true)]
    private $reductions;
    #[Groups(['read:enchereInverse:collection'])]
    #[ORM\OneToOne(inversedBy: 'enchereInverse', targetEntity: Fermeture::class, orphanRemoval: true, cascade: ['persist', 'remove'])]
    private $fermeture;

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    #[ORM\Column(type: 'datetime')]
    private $updatedAt;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:surveille:collection','read:enchereInverse:collection'])]
    private $user;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'enchereInverses')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:enchereInverse:item','write:enchereInverse'])]
    private $category;



    public function __construct()
    {
        $this->surveilles = new ArrayCollection();
        $this->reductions = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
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

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(Article $article): self
    {
        $this->article = $article;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getInitPrice(): ?float
    {
        return $this->initPrice;
    }

    public function setInitPrice(float $initPrice): self
    {
        $this->initPrice = $initPrice;

        return $this;
    }

    public function getImmediatePrice(): ?float
    {
        return $this->immediatePrice;
    }

    public function setImmediatePrice(float $immediatePrice): self
    {
        $this->immediatePrice = $immediatePrice;

        return $this;
    }

    public function getCurrentPrice(): ?float
    {
        return $this->currentPrice;
    }

    public function setCurrentPrice(float $currentPrice): self
    {
        $this->currentPrice = $currentPrice;

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTime $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTime $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * @return Collection|Surveille[]
     */
    public function getSurveilles(): Collection
    {
        return $this->surveilles;
    }

    public function addSurveille(Surveille $surveille): self
    {
        if (!$this->surveilles->contains($surveille)) {
            $this->surveilles[] = $surveille;
            $surveille->setEnchereInverse($this);
        }

        return $this;
    }

    public function removeSurveille(Surveille $surveille): self
    {
        if ($this->surveilles->removeElement($surveille)) {
            // set the owning side to null (unless already changed)
            if ($surveille->getEnchereInverse() === $this) {
                $surveille->setEnchereInverse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Reduction[]
     */
    public function getReductions(): Collection
    {
        return $this->reductions;
    }

    public function addReduction(Reduction $reduction): self
    {
        if (!$this->reductions->contains($reduction)) {
            $this->reductions[] = $reduction;
            $reduction->setEnchereInverse($this);
        }

        return $this;
    }

    public function removeReduction(Reduction $reduction): self
    {
        if ($this->reductions->removeElement($reduction)) {
            // set the owning side to null (unless already changed)
            if ($reduction->getEnchereInverse() === $this) {
                $reduction->setEnchereInverse(null);
            }
        }

        return $this;
    }

    public function getFermeture(): ?Fermeture
    {
        return $this->fermeture;
    }

    public function setFermeture(?Fermeture $fermeture): self
    {
        $this->fermeture = $fermeture;

        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTime $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    
}
