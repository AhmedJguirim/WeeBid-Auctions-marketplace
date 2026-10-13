<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:create-admin', description: 'Creates an admin user (no-op if the email already exists)')]
class CreateAdminCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('email', InputArgument::REQUIRED)
            ->addArgument('password', InputArgument::REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        if ($this->em->getRepository(User::class)->findOneBy(['email' => $email])) {
            $output->writeln("Admin $email already exists, nothing to do.");
            return Command::SUCCESS;
        }

        $user = new User();
        $user->setName('Admin');
        $user->setDisplayName('admin');
        $user->setEmail($email);
        $user->setTelephone('00000000');
        $user->setRoles(['ROLE_ADMIN']);
        $user->setIsActive(true);
        $user->setPassword($this->hasher->hashPassword($user, $input->getArgument('password')));

        $this->em->persist($user);
        $this->em->flush();
        $output->writeln("Admin $email created.");

        return Command::SUCCESS;
    }
}
