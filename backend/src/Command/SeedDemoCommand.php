<?php

namespace App\Command;

use App\Entity\Adresse;
use App\Entity\Article;
use App\Entity\Augmentation;
use App\Entity\Category;
use App\Entity\Document;
use App\Entity\Enchere;
use App\Entity\EnchereInverse;
use App\Entity\Reduction;
use App\Entity\Surveille;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Fills the database with demo data (users, categories, auctions, bids) so the
 * app looks alive. Re-running it only refreshes the auction dates, so the demo
 * never ends up with every auction expired.
 */
#[AsCommand(name: 'app:seed-demo', description: 'Creates demo data (or just refreshes the dates of existing demo auctions)')]
class SeedDemoCommand extends Command
{
    private const PASSWORD = 'demo1234';

    private const CATEGORIES = [
        ['Électronique', '💻', ['#6366f1', '#8b5cf6']],
        ['Mode', '👜', ['#ec4899', '#f43f5e']],
        ['Maison', '🛋️', ['#f59e0b', '#f97316']],
        ['Sport', '🚲', ['#10b981', '#14b8a6']],
        ['Musique', '🎸', ['#3b82f6', '#06b6d4']],
        ['Collection', '🕰️', ['#a855f7', '#6366f1']],
    ];

    private const USERS = [
        ['Amine Ben Salah', 'amine_bs', 'amine@weebid.local'],
        ['Sarra Trabelsi', 'sarra_t', 'sarra@weebid.local'],
        ['Yassine Mejri', 'yassine_m', 'yassine@weebid.local'],
        ['Nour Gharbi', 'nour_g', 'nour@weebid.local'],
        ['Karim Jlassi', 'karim_j', 'karim@weebid.local'],
    ];

    // name, emoji, category index, state, brand, ville, init price, immediate price, quantity, ends in (hours), bids, description
    private const ENCHERES = [
        ['Appareil photo', '📷', 5, 'utilisé', 'Canon', 'Tunis', 120, 450, 1, 30, 7, "Reflex argentique vintage des années 80, entièrement fonctionnel, livré avec objectif 50mm et sangle d'origine."],
        ['Clavier méca', '⌨️', 0, 'neuf', 'Keychron', 'Sfax', 90, 220, 1, 6, 9, 'Clavier mécanique 75% sans fil, switchs Brown, rétroéclairage RGB. Jamais déballé.'],
        ['Vélo de route', '🚲', 3, 'utilisé', 'Giant', 'Sousse', 400, 1200, 1, 52, 5, 'Cadre carbone, groupe Shimano 105, très bien entretenu. Environ 3000 km au compteur.'],
        ['Guitare folk', '🎸', 4, 'utilisé', 'Yamaha', 'Ariana', 150, 480, 1, 80, 4, 'Guitare acoustique avec table en épicéa massif, cordes neuves, housse fournie.'],
        ['Montre auto', '⌚', 5, 'neuf', 'Seiko', 'Tunis', 250, 700, 1, 3, 11, 'Montre automatique, boîtier acier 40mm, bracelet cuir. Boîte et garantie incluses.'],
        ['Laptop gaming', '💻', 0, 'utilisé', 'Asus', 'Nabeul', 900, 2400, 1, 120, 6, 'RTX 3060, 16 Go de RAM, SSD 1 To. Très peu servi, batterie en excellent état.'],
        ['Veste en cuir', '🧥', 1, 'neuf', 'Zara', 'Bizerte', 60, 190, 1, 40, 3, "Veste en cuir véritable, taille M, coupe moderne. Étiquette encore attachée."],
        ['Fauteuil velours', '🛋️', 2, 'utilisé', 'Ikea', 'Monastir', 80, 260, 1, 96, 2, 'Fauteuil en velours vert émeraude, pieds en chêne. Parfait pour un salon moderne.'],
        ['Console de jeux', '🎮', 0, 'utilisé', 'Sony', 'La Marsa', 300, 800, 1, 18, 8, 'Console de salon avec deux manettes et cinq jeux, en parfait état de marche.'],
        ['Sac à dos', '🎒', 1, 'neuf', 'Fjällräven', 'Sfax', 70, 180, 3, 150, 1, 'Sac de randonnée imperméable 28L, plusieurs coloris disponibles.'],
        ['Tapis berbère', '🧶', 2, 'utilisé', 'Artisanal', 'Kairouan', 200, 900, 1, 60, 5, 'Tapis noué main en laine, motifs traditionnels, 2m x 1,4m.'],
        ['Casque audio', '🎧', 4, 'neuf', 'Sony', 'Tunis', 110, 330, 2, 24, 6, 'Casque à réduction de bruit active, autonomie 30 heures, étui rigide inclus.'],
    ];

    // name, emoji, category index, brand, ville, start price (max budget), quantity, ends in (hours), reductions, description
    private const INVERSES = [
        ['Ordinateur portable', '💻', 0, 'Lenovo', 'Tunis', 1500, 1, 72, 4, "Je cherche un portable fiable pour les études, 16 Go de RAM minimum. Les fournisseurs proposent leurs meilleurs prix."],
        ['Vélo électrique', '🚴', 3, 'Peu importe', 'Sousse', 3000, 1, 130, 3, 'À la recherche d\'un vélo électrique de ville, autonomie 60 km minimum.'],
        ['Appareil photo', '📸', 5, 'Canon', 'Sfax', 1800, 1, 48, 5, 'Boîtier hybride récent avec objectif de kit, garantie d\'au moins un an.'],
        ['Canapé 3 places', '🛋️', 2, 'Peu importe', 'Ariana', 1200, 1, 100, 2, 'Canapé confortable en tissu gris clair, livraison incluse si possible.'],
        ['Piano numérique', '🎹', 4, 'Yamaha', 'Nabeul', 2000, 1, 160, 3, '88 touches lestées, avec pied et pédale. Neuf ou très bon état.'],
        ['Montres connectées', '⌚', 0, 'Peu importe', 'Tunis', 600, 5, 36, 6, 'Lot de 5 montres connectées pour une équipe sportive.'],
    ];

    /** English texts, used when the demo is seeded with --locale=en (SEED_LOCALE=en). Same order as the arrays above. */
    private const EN = [
        'any' => 'Any',
        'categories' => ['Electronics', 'Fashion', 'Home', 'Sports', 'Music', 'Collectibles'],
        'encheres' => [
            ['Film camera', 'Vintage 80s film SLR, fully working, comes with a 50mm lens and the original strap.'],
            ['Mech keyboard', 'Wireless 75% mechanical keyboard, brown switches, RGB backlight. Never unboxed.'],
            ['Road bike', 'Carbon frame, Shimano 105 groupset, very well maintained. About 3,000 km on the clock.'],
            ['Folk guitar', 'Acoustic guitar with a solid spruce top, brand new strings, gig bag included.'],
            ['Auto watch', 'Automatic watch, 40mm steel case, leather strap. Box and warranty included.'],
            ['Gaming laptop', 'RTX 3060, 16 GB of RAM, 1 TB SSD. Barely used, battery in excellent condition.'],
            ['Leather jacket', 'Genuine leather jacket, size M, modern cut. Tag still attached.'],
            ['Velvet armchair', 'Emerald green velvet armchair with oak legs. Perfect for a modern living room.'],
            ['Game console', 'Home console with two controllers and five games, in perfect working order.'],
            ['Backpack', 'Waterproof 28L hiking backpack, several colours available.'],
            ['Berber rug', 'Hand-knotted wool rug with traditional patterns, 2m x 1.4m.'],
            ['Headphones', 'Active noise-cancelling headphones, 30-hour battery life, hard case included.'],
        ],
        'inverses' => [
            ['Laptop', 'Looking for a reliable laptop for studies, 16 GB of RAM minimum. Suppliers, send me your best prices.'],
            ['Electric bike', 'Looking for a city e-bike with at least 60 km of range.'],
            ['Camera', 'Recent mirrorless body with kit lens, at least one year of warranty.'],
            ['3-seater sofa', 'Comfortable light grey fabric sofa, delivery included if possible.'],
            ['Digital piano', '88 weighted keys, with stand and pedal. New or in very good condition.'],
            ['Smartwatches', 'Batch of 5 smartwatches for a sports team.'],
        ],
    ];

    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher,
        private string $projectDir = ''
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('locale', null, InputOption::VALUE_REQUIRED, 'Language of the demo content: fr or en', 'fr');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $en = $input->getOption('locale') === 'en';
        if ($this->em->getRepository(User::class)->findOneBy(['email' => self::USERS[0][2]])) {
            $this->refreshDates();
            $output->writeln('Demo data already present: auction dates refreshed.');
            return Command::SUCCESS;
        }

        $dir = $this->projectDir ?: dirname(__DIR__, 2);
        foreach (['media', 'category', 'user'] as $d) {
            @mkdir("$dir/public/$d", 0775, true);
        }

        // categories
        $categories = [];
        foreach (self::CATEGORIES as $i => [$name, $emoji, $colors]) {
            $name = $en ? self::EN['categories'][$i] : $name;
            $file = "category-$i.svg";
            file_put_contents("$dir/public/category/$file", $this->svg($emoji, $colors, 600, 400));
            $c = (new Category())->setName($name)->setImage($file);
            $this->em->persist($c);
            $categories[$i] = $c;
        }

        // users
        $users = [];
        foreach (self::USERS as $i => [$name, $display, $email]) {
            $file = "avatar-$i.svg";
            $palette = self::CATEGORIES[$i % count(self::CATEGORIES)][2];
            file_put_contents("$dir/public/user/$file", $this->svg(mb_strtoupper(mb_substr($name, 0, 1)), $palette, 200, 200, true));
            $u = new User();
            $u->setName($name)->setDisplayName($display)->setEmail($email)->setTelephone('2' . str_pad((string) (1234567 + $i * 1111), 7, '0', STR_PAD_LEFT))
                ->setRoles([])->setIsActive(true)->setImage($file);
            $u->setPassword($this->hasher->hashPassword($u, self::PASSWORD));
            $this->em->persist($u);
            $users[] = $u;

            $a = new Adresse();
            $a->setPays('Tunisie')->setVille(['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte'][$i])->setRue('Rue de la République')->setZipcode('1000')->setUser($u);
            $this->em->persist($a);
        }

        $now = new \DateTime();
        $minutes = 0;
        // auctions
        foreach (self::ENCHERES as $i => [$name, $emoji, $cat, $state, $brand, $ville, $init, $imm, $qty, $hours, $bids, $desc]) {
            if ($en) {
                [$name, $desc] = self::EN['encheres'][$i];
            }
            $article = $this->article($dir, "e$i", $name, $emoji, $categories[$cat], $state, $brand, $ville, $desc);
            $e = new Enchere();
            $e->setArticle($article)->setCategory($categories[$cat])->setUser($users[$i % count($users)])
                ->setQuantity($qty)->setInitPrice($init)->setImmediatePrice($imm)->setCurrentPrice($init)
                ->setStartDate((clone $now)->modify('-2 days'))->setEndDate((clone $now)->modify("+$hours hours"));
            // a couple of auctions that haven't started yet
            if (in_array($i, [9, 7], true)) {
                $e->setStartDate((clone $now)->modify('+3 hours'));
                $bids = 0;
            }
            $price = $init;
            $this->em->persist($e);
            for ($b = 0; $b < $bids; $b++) {
                $price += max(5, (int) round($init * 0.06)) + $b * 2;
                $bidder = $users[($i + $b + 1) % count($users)];
                $aug = new Augmentation();
                $aug->setValue($price)->setDate((clone $now)->modify('-' . (($bids - $b) * 55 + $minutes++) . ' minutes'))->setUser($bidder)->setEnchere($e);
                $this->em->persist($aug);
            }
            $e->setCurrentPrice($price);
            $w = (new Surveille())->setUser($users[($i + 2) % count($users)])->setEnchere($e);
            $this->em->persist($w);
        }

        // reverse auctions
        foreach (self::INVERSES as $i => [$name, $emoji, $cat, $brand, $ville, $start, $qty, $hours, $reds, $desc]) {
            if ($en) {
                [$name, $desc] = self::EN['inverses'][$i];
                $brand = $brand === 'Peu importe' ? self::EN['any'] : $brand;
            }
            $article = $this->article($dir, "i$i", $name, $emoji, $categories[$cat], 'neuf', in_array($brand, ['Peu importe', self::EN['any']], true) ? null : $brand, $ville, $desc);
            $e = new EnchereInverse();
            $e->setArticle($article)->setCategory($categories[$cat])->setUser($users[($i + 1) % count($users)])
                ->setQuantity($qty)->setInitPrice($start)->setImmediatePrice((int) ($start * 0.6))->setCurrentPrice($start)
                ->setStartDate((clone $now)->modify('-1 day'))->setEndDate((clone $now)->modify("+$hours hours"));
            $this->em->persist($e);
            $price = $start;
            for ($r = 0; $r < $reds; $r++) {
                $price = (int) round($price * 0.93);
                $red = new Reduction();
                $red->setValue($price)->setDate((clone $now)->modify('-' . (($reds - $r) * 70 + $minutes++) . ' minutes'))->setUser($users[($i + $r + 2) % count($users)])->setEnchereInverse($e);
                $this->em->persist($red);
            }
            $e->setCurrentPrice($price);
        }

        $this->em->flush();
        $output->writeln('Demo data created. Demo users: ' . implode(', ', array_column(self::USERS, 2)) . ' / password ' . self::PASSWORD);
        return Command::SUCCESS;
    }

    /** Pushes every auction end date into the future again (keeps the relative offsets of the seed). */
    private function refreshDates(): void
    {
        $now = new \DateTime();
        foreach (['App\Entity\Enchere', 'App\Entity\EnchereInverse'] as $class) {
            foreach ($this->em->getRepository($class)->findAll() as $i => $e) {
                if ($e->getEndDate() > $now) {
                    continue;
                }
                $e->setStartDate((clone $now)->modify('-1 day'));
                $e->setEndDate((clone $now)->modify('+' . (12 + ($i * 17) % 120) . ' hours'));
            }
        }
        $this->em->flush();
    }

    private function article(string $dir, string $key, string $name, string $emoji, Category $cat, string $state, ?string $brand, string $ville, string $desc): Article
    {
        $colors = self::CATEGORIES[$this->colorIndex($cat)][2];
        $file = "demo-$key.svg";
        file_put_contents("$dir/public/media/$file", $this->svg($emoji, $colors, 800, 600));

        $a = new Article();
        $a->setName($name)->setState($state)->setLocalisation($ville)->setBrand($brand)->setDescription($desc)
            ->setFabricationDate(new \DateTime('-2 years'));
        $this->em->persist($a);
        $d = new Document();
        $d->setArticle($a);
        $d->filePath = $file;
        $this->em->persist($d);
        return $a;
    }

    private function colorIndex(Category $cat): int
    {
        foreach (self::CATEGORIES as $i => [$name]) {
            if ($name === $cat->getName()) {
                return $i;
            }
        }
        return 0;
    }

    private function svg(string $glyph, array $colors, int $w, int $h, bool $round = false): string
    {
        $size = (int) ($h * ($round ? 0.5 : 0.42));
        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="$w" height="$h" viewBox="0 0 $w $h">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{$colors[0]}"/><stop offset="1" stop-color="{$colors[1]}"/></linearGradient></defs>
<rect width="$w" height="$h" fill="url(#g)"/>
<circle cx="{$w}" cy="0" r="{$h}" fill="#fff" opacity=".08"/><circle cx="0" cy="{$h}" r="{$h}" fill="#fff" opacity=".07"/>
<text x="50%" y="52%" font-size="$size" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Inter,Segoe UI,Apple Color Emoji,Noto Color Emoji,sans-serif" font-weight="700">$glyph</text>
</svg>
SVG;
    }
}
