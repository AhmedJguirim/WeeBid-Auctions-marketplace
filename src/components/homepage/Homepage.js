import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowRight, BadgeCheck, Bell, FileText, Gavel, Timer, TrendingDown, Zap } from "lucide-react";
import { apiRoutes, navRoutes } from "../../config/routes";
import { BACKEND_URL } from "../../config/env";
import ProductsListing from "../generalComponents/ProductsListing";
import Countdown from "../ui/Countdown";
import demoListImage from "../../media/images/demoListImage.png";

const SectionTitle = ({ eyebrow, title, to, linkText = "Voir tout" }) => (
  <div className="mb-6 flex items-end justify-between gap-4">
    <div>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
    </div>
    {to && (
      <Link to={to} className="hidden items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-800 sm:inline-flex">
        {linkText} <ArrowRight size={16} />
      </Link>
    )}
  </div>
);

const Stat = ({ value, label }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
    <p className="text-3xl font-extrabold tabular-nums text-white">{value ?? "–"}</p>
    <p className="text-sm text-brand-200">{label}</p>
  </div>
);

const FeaturedCard = ({ vente }) => {
  if (!vente) return null;
  const doc = vente.article.documents && vente.article.documents[0];
  return (
    <Link
      to={`${navRoutes.ENCHERE}/${vente.id}`}
      className="group relative block w-full max-w-sm rotate-2 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/20 transition duration-500 hover:rotate-0"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={doc ? `${BACKEND_URL}${doc.contentUrl}` : demoListImage} alt={vente.article.name} className="h-full w-full object-cover" />
        <span className="badge absolute left-4 top-4 bg-white/95 text-emerald-600 shadow">
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500" /> À la une
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900">{vente.article.name}</h3>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Offre actuelle</p>
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">
              {vente.currentPrice} <span className="text-sm font-semibold text-slate-500">TND</span>
            </p>
          </div>
          <Countdown startDate={vente.startDate} endDate={vente.endDate} />
        </div>
      </div>
    </Link>
  );
};

const steps = [
  { icon: BadgeCheck, title: "Créez votre compte", text: "L'inscription est gratuite et prend moins d'une minute. Aucun frais de mise en vente, aucun dépôt pour enchérir." },
  { icon: Timer, title: "Choisissez votre moment", text: "Le vendeur fixe lui-même la date de début et la durée de son enchère. Vous suivez le compte à rebours en direct." },
  { icon: Zap, title: "Enchérissez en temps réel", text: "Les prix se mettent à jour instantanément pour tout le monde, et vous êtes notifié quand quelqu'un surenchérit." },
];

const services = [
  { icon: Gavel, title: "Enchères", text: "Mettez un article en vente et laissez les acheteurs se faire concurrence pour obtenir le meilleur prix.", to: navRoutes.ENCHERES },
  { icon: TrendingDown, title: "Enchères inversées", text: "Publiez un besoin : les vendeurs rivalisent en baissant leur prix pour décrocher la vente.", to: navRoutes.ENCHERESINVERSES },
  { icon: FileText, title: "Demandes de devis", text: "Demandez directement à un fournisseur une proposition sur un produit spécifique.", to: navRoutes.CATEGORIES },
];

const Homepage = () => {
  const user = useSelector((state) => state.user);
  const [encheres, setEncheres] = React.useState([]);
  const [encheresInverses, setEncheresInverses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [count, setCount] = React.useState({});

  React.useEffect(() => {
    const now = new Date();
    const params = { fermeture: null, page: "1", "endDate[after]": now };
    axios.get(`${apiRoutes.API}/encheres/getEight`, { params }).then((r) => setEncheres(r.data["hydra:member"])).catch(console.log);
    axios.get(`${apiRoutes.API}/enchere_inverses/getEight`, { params }).then((r) => setEncheresInverses(r.data["hydra:member"])).catch(console.log);
    axios.get(`${apiRoutes.API}/categories`).then((r) => setCategories(r.data["hydra:member"])).catch(console.log);
    axios
      .get(`${apiRoutes.API}/count`)
      .then((r) => {
        const m = r.data["hydra:member"];
        setCount({ enchere: m[0], enchereInverse: m[1], user: m[2] });
      })
      .catch(console.log);
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="badge border border-white/15 bg-white/5 text-brand-200">
              <Bell size={13} /> Prix mis à jour en temps réel
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Chaque objet a son prix.{" "}
              <span className="bg-gradient-to-r from-brand-300 to-fuchsia-300 bg-clip-text text-transparent">Fixez le vôtre.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Achetez et vendez aux enchères, lancez des enchères inversées ou demandez un devis. Sans frais de mise en vente, sans dépôt pour enchérir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={navRoutes.ENCHERES} className="btn-primary !bg-white !px-6 !py-3 !text-brand-800 hover:!bg-brand-50">
                Découvrir les enchères <ArrowRight size={16} />
              </Link>
              <Link
                to={user.id === undefined ? navRoutes.REGISTER : navRoutes.MAKE_ARTICLE}
                className="btn border border-white/20 !px-6 !py-3 text-white hover:bg-white/10"
              >
                {user.id === undefined ? "Créer un compte" : "Vendre un article"}
              </Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
              <Stat value={count.enchere} label="enchères" />
              <Stat value={count.enchereInverse} label="inversées" />
              <Stat value={count.user} label="membres" />
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <FeaturedCard vente={encheres[0]} />
          </div>
        </div>
      </section>

      {/* categories */}
      {categories.length > 0 && (
        <section className="container-page pt-16">
          <SectionTitle eyebrow="Explorer" title="Parcourir par catégorie" to={navRoutes.CATEGORIES} linkText="Toutes les catégories" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${c.id}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                {c.image && <img src={`${BACKEND_URL}/category/${c.image}`} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-bold text-white">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* live auctions */}
      <section className="container-page pt-16">
        <SectionTitle eyebrow="À ne pas manquer" title="Enchères du moment" to={navRoutes.ENCHERES} />
        <ProductsListing ventes={encheres} type={navRoutes.ENCHERE} limit={4} />
      </section>

      <section className="container-page pt-16">
        <SectionTitle eyebrow="Le prix le plus bas gagne" title="Enchères inversées" to={navRoutes.ENCHERESINVERSES} />
        <ProductsListing ventes={encheresInverses} type={navRoutes.ENCHEREINVERSE} limit={4} />
      </section>

      {/* how it works */}
      <section className="mt-20 bg-white py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Comment ça marche</p>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Simple, flexible, transparent</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative rounded-2xl bg-slate-50 p-7">
                <span className="absolute right-6 top-5 text-5xl font-black text-slate-200">{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* services */}
      <section className="container-page pt-20">
        <SectionTitle eyebrow="Nos services" title="Trois façons d'échanger" />
        <div className="grid gap-5 md:grid-cols-3">
          {services.map(({ icon: Icon, title, text, to }) => (
            <Link key={title} to={to} className="group card p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                En savoir plus <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-8 py-14 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Prêt à lancer votre première enchère ?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-100">Publiez un article en quelques minutes et laissez la communauté faire monter les prix.</p>
          <Link to={user.id === undefined ? navRoutes.REGISTER : navRoutes.MAKE_ARTICLE} className="btn relative mt-8 !bg-white !px-7 !py-3 !text-brand-800 hover:!bg-brand-50">
            {user.id === undefined ? "Créer un compte gratuit" : "Vendre un article"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
