<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use App\Repository\NotificationRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ApiResource(
    paginationItemsPerPage:5 ,
    collectionOperations:[
        "getTable"=>[
            "path" => "/notificationTable",
            'method' => "GET",
            "pagination_items_per_page" => 15,
        ],
        "get",
        "post",
        "getLast"=>[
            "path" => "/notificationLast",
            'method' => "GET",
            "pagination_items_per_page" => 1,
        ],
    ],
    itemOperations: [
        'get',
        "delete"
    ]
)]
#[ApiFilter(OrderFilter::class, properties: ['date' => 'DESC'])]
#[ApiFilter(SearchFilter::class, properties: ['user' => 'exact'])]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;


    #[ORM\Column(type: 'string', length: 255)]
    private $description;

    #[ORM\Column(type: 'string', length: 255)]
    private $title;

    #[ORM\Column(type: 'datetime')]
    private $date;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    private $user;

    #[ORM\Column(type: 'string', length: 255)]
    private $route;

    #[ORM\Column(type: 'string', length: 255)]
    private $type;

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

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

    public function getRoute(): ?string
    {
        return $this->route;
    }

    public function setRoute(string $route): self
    {
        $this->route = $route;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}
