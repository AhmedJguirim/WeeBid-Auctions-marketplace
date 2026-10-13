<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\TestRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\SurveilleCountController;
use ApiPlatform\Core\OpenApi\Model\Parameter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;



#[ORM\Entity(repositoryClass: TestRepository::class)]
#[ApiResource()
,ApiFilter(SearchFilter::class, properties: ['name'=>'partial'])]

class Test
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'binary')]
    private $file;

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

        return $this;
    }
}
