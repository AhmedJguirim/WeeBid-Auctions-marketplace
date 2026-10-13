<?php

namespace App\Entity;

use DateTime;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Vich\UploaderBundle\Mapping\Annotation\Uploadable;


/**
 * @Vich\Uploadable
 */
#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:category:collection']],
    denormalizationContext: ['groups' => ['write:category']],
    collectionOperations: [
        "get",
        "post" => ["security" => "is_granted('ROLE_ADMIN')"],
    ],
    itemOperations: [
        'delete'=> ["security" => "is_granted('ROLE_ADMIN')"],
        'put'=> ["security" => "is_granted('ROLE_ADMIN')"],
        'get' => [
            'normalisation_context' => ['groups' => ['read:category:collection', 'read:category:item']]
        ]
    ]
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:category:collection','read:enchere:item' , 'read:enchereInverse:item' ,'read:enchereInverse:item' ])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['read:category:collection', 'write:category', 'read:enchere:item' , 'read:enchereInverse:item' ,'read:enchereInverse:item'])]
    private $name;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Enchere::class)]
    private $encheres;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: EnchereInverse::class)]
    private $enchereInverses;


    // #[ORM\OneToOne(mappedBy: 'image',targetEntity: GeneralDocs::class, cascade: ['persist', 'remove'])]
    #[Groups(['read:category:collection', 'write:category', 'read:enchere:item' , 'read:enchereInverse:item' ,'read:enchereInverse:item'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $image = "";
    
        /**
     * @Vich\UploadableField(mapping="category", fileNameProperty="image")
     */
    public ?File $file = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private $updatedAt;

    public function __construct()
    {
        $this->image= "";
        $this->encheres = new ArrayCollection();
        $this->enchereInverses = new ArrayCollection();
        $this->updatedAt = new DateTime();
    }



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getFile()
    {
        return $this->file;
    }

    public function setFile($file): self
    {
        $this->file = $file;
        if ($file){
            $this->updatedAt = new DateTime();
        }
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        if($image == null){
            $this->image ="";
        }else{
            $this->image = $image;
        }
        

        return $this;
    }

    /**
     * @return Collection|Enchere[]
     */
    public function getEncheres(): Collection
    {
        return $this->encheres;
    }

    public function addEnchere(Enchere $enchere): self
    {
        if (!$this->encheres->contains($enchere)) {
            $this->encheres[] = $enchere;
            $enchere->setCategory($this);
        }

        return $this;
    }

    public function removeEnchere(Enchere $enchere): self
    {
        if ($this->encheres->removeElement($enchere)) {
            // set the owning side to null (unless already changed)
            if ($enchere->getCategory() === $this) {
                $enchere->setCategory(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|EnchereInverse[]
     */
    public function getEnchereInverses(): Collection
    {
        return $this->enchereInverses;
    }

    public function addEnchereInverse(EnchereInverse $enchereInverse): self
    {
        if (!$this->enchereInverses->contains($enchereInverse)) {
            $this->enchereInverses[] = $enchereInverse;
            $enchereInverse->setCategory($this);
        }

        return $this;
    }

    public function removeEnchereInverse(EnchereInverse $enchereInverse): self
    {
        if ($this->enchereInverses->removeElement($enchereInverse)) {
            // set the owning side to null (unless already changed)
            if ($enchereInverse->getCategory() === $this) {
                $enchereInverse->setCategory(null);
            }
        }

        return $this;
    }

    
    // public function getImage(): ?GeneralDocs
    // {
    //     return $this->image;
    // }

    // public function setImage(?GeneralDocs $image): self
    // {
    //     $this->image = $image;

    //     return $this;
    // }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

   
}
