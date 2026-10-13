<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(name: 'app:create-admin', description: 'Creates an admin user, or a plain service account with --role=ROLE_USER (no-op if the email already exists)')]
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
            ->addArgument('password', InputArgument::REQUIRED)
            ->addOption('role', null, InputOption::VALUE_REQUIRED, 'ROLE_ADMIN or ROLE_USER', 'ROLE_ADMIN')
            ->addOption('display-name', null, InputOption::VALUE_REQUIRED, 'Public user name', 'admin')
            ->addOption('sync-password', null, InputOption::VALUE_NONE, 'If the user already exists, set its password to the given one');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $email = $input->getArgument('email');
        $existing = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing) {
            if ($input->getOption('sync-password')) {
                $existing->setPassword($this->hasher->hashPassword($existing, $input->getArgument('password')));
                $this->em->flush();
                $output->writeln("User $email already exists: password synchronised.");
            } else {
                $output->writeln("Admin $email already exists, nothing to do.");
            }
            return Command::SUCCESS;
        }

        $user = new User();
        $display = $input->getOption('display-name');
        $user->setName(ucfirst($display));
        $user->setDisplayName($display);
        $user->setEmail($email);
        $user->setTelephone('00000000');
        $user->setRoles($input->getOption('role') === 'ROLE_ADMIN' ? ['ROLE_ADMIN'] : []);
        $user->setIsActive(true);
        $user->setPassword($this->hasher->hashPassword($user, $input->getArgument('password')));

        $this->em->persist($user);
        $this->em->flush();
        $output->writeln("Admin $email created.");

        return Command::SUCCESS;
    }
}
