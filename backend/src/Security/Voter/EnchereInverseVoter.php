<?php

namespace App\Security\Voter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class EnchereInverseVoter extends Voter
{
    /** a member cannot have more than this many running listings of this kind (keeps the database from being flooded) */
    private const MAX_ACTIVE_LISTINGS = 30;

    public function __construct(private EntityManagerInterface $em)
    {
    }

    private function activeListings($user): int
    {
        return (int) $this->em->createQueryBuilder()
            ->select('COUNT(e.id)')
            ->from(\App\Entity\EnchereInverse::class, 'e')
            ->where('e.user = :user')->andWhere('e.endDate > :now')
            ->setParameter('user', $user)->setParameter('now', new \DateTime())
            ->getQuery()->getSingleScalarResult();
    }

    protected function supports(string $attribute, $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, ['EDIT', 'REMOVE', "POST"])
            && $subject instanceof \App\Entity\EnchereInverse;
    }

    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        switch ($attribute) {
            case 'POST':
                // logic to determine if the user can EDIT
                // return true or false
                
                if ($this->activeListings($user) >= self::MAX_ACTIVE_LISTINGS) {                
                    return false;                
                }                
                if ($subject->getUser() === $user) {
                    return true;
                }
                elseif ($user->getRoles()== "ROLE_ADMIN") {
                    return true;
                }
                break;
            case 'EDIT':
                // logic to determine if the user can EDIT
                // return true or false
                if ($subject->getUser() === $user) {
                    return true;
                }
                elseif ($user->getRoles()== "ROLE_ADMIN") {
                    return true;
                }
                break;
            case 'REMOVE':
                if ($subject->getUser() === $user) {
                    return true;
                }
                elseif ($user->getRoles()== "ROLE_ADMIN") {
                    return true;
                }
                break;
        }

        return false;
    }
}
