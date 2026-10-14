import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { apiRoutes, navRoutes } from "../../config/routes";
import { BACKEND_URL } from "../../config/env";
import ProductsListing from "../generalComponents/ProductsListing";

// The files under /public/assets are not committed yet: until they exist the browser
// shows the alt text, which says exactly what picture belongs in each slot.
const ASSETS = "/assets/home";

const SectionTitle = ({ title, to, linkText }) => (
  <div className="mb-8 text-center">
    <h2 className="text-3xl font-normal text-gray-900">{title}</h2>
    {to && (
      <Link to={to} className="mt-2 inline-block text-sm text-gray-900 underline underline-offset-2 hover:text-brand-600">
        {linkText}
      </Link>
    )}
  </div>
);

// dark caption box with the blue bottom edge used for the shop tiles
const Tile = ({ to, image, alt, title, text }) => (
  <Link to={to} className="group relative block aspect-[4/3] overflow-hidden bg-gray-100">
    <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    <div className="absolute bottom-6 left-6 min-w-[11rem] border-b-4 border-brand-600 bg-gray-900 px-5 py-4 text-white transition group-hover:bg-black">
      <h3 className="text-xl font-bold">{title}</h3>
      {text && <p className="mt-1 text-sm">{text}</p>}
    </div>
  </Link>
);

const Homepage = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;
  const [encheres, setEncheres] = React.useState([]);
  const [encheresInverses, setEncheresInverses] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const now = new Date();
    const params = { fermeture: null, page: "1", "endDate[after]": now };
    axios.get(`${apiRoutes.API}/encheres/getEight`, { params }).then((r) => setEncheres(r.data["hydra:member"])).catch(console.log);
    axios.get(`${apiRoutes.API}/enchere_inverses/getEight`, { params }).then((r) => setEncheresInverses(r.data["hydra:member"])).catch(console.log);
    axios.get(`${apiRoutes.API}/categories`).then((r) => setCategories(r.data["hydra:member"])).catch(console.log);
  }, []);

  const sellLink = loggedIn ? navRoutes.MAKE_ARTICLE : navRoutes.REGISTER;

  return (
    <div>
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-gray-100">
        <img
          src={`${ASSETS}/hero.jpg`}
          alt="Wide banner photo, light and airy: a person smiling while holding a freshly won vintage camera, auction items blurred in the background. Subject on the right, left third kept empty for the headline."
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="container-page flex min-h-[26rem] items-center py-16 lg:min-h-[34rem]">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl">
              {t("home.title1")}
              <br />
              {t("home.title2")}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-900">{t("home.subtitle")}</p>
            <Link to={navRoutes.ENCHERES} className="btn-primary mt-8 !px-10 !py-3.5">{t("home.ctaBrowse")}</Link>
          </div>
        </div>
      </section>

      {/* three ways to trade */}
      <section className="container-page -mt-4 grid gap-6 pb-4 pt-10 md:grid-cols-3">
        <Tile
          to={navRoutes.ENCHERES}
          image={`${ASSETS}/tile-auctions.jpg`}
          alt="Close-up of a wooden auction gavel resting on a stack of vintage books, soft daylight"
          title={t("home.service_auctions_title")}
          text={t("home.tileAuctions")}
        />
        <Tile
          to={navRoutes.ENCHERESINVERSES}
          image={`${ASSETS}/tile-reverse.jpg`}
          alt="Two people at a workshop table comparing quotes on a laptop, one pointing at the screen"
          title={t("home.service_reverse_title")}
          text={t("home.tileReverse")}
        />
        <Tile
          to={navRoutes.CATEGORIES}
          image={`${ASSETS}/tile-categories.jpg`}
          alt="Flat-lay of assorted marketplace goods: a sneaker, a watch, a ceramic mug, a plant, a small speaker"
          title={t("home.browseCategories")}
          text={t("home.tileCategories")}
        />
      </section>

      {/* split block */}
      <section className="container-page grid items-center gap-10 py-16 md:grid-cols-2">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold leading-tight text-gray-900">{t("home.howTitle")}</h2>
          <ol className="mt-6 space-y-4 text-base leading-relaxed text-gray-900">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <strong className="block">{t(`home.step${n}Title`)}</strong>
                {t(`home.step${n}Text`)}
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={sellLink} className="btn-secondary !px-8 !py-3">{loggedIn ? t("nav.sellItem") : t("home.ctaRegister")}</Link>
            <Link to={navRoutes.ENCHERES} className="btn-secondary !px-8 !py-3">{t("home.ctaBrowse")}</Link>
          </div>
        </div>
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={`${ASSETS}/how-it-works.jpg`}
            alt="Person at a desk looking at a phone showing a live bid countdown, a parcel and packing tape beside them"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* hot auctions */}
      <section className="container-page pb-6">
        <SectionTitle title={t("home.liveTitle")} to={navRoutes.ENCHERES} linkText={t("common.viewAll")} />
        <ProductsListing ventes={encheres} type={navRoutes.ENCHERE} limit={4} />
      </section>

      {/* dark call-out */}
      <section className="relative isolate mt-16 overflow-hidden bg-gray-100">
        <img
          src={`${ASSETS}/cta.jpg`}
          alt="Wide photo of a tidy home workspace with boxed items ready to ship, warm light, empty space on the left"
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="container-page flex justify-end py-16 lg:py-24">
          <div className="w-full max-w-lg bg-gray-900 p-10 text-white">
            <h2 className="text-3xl font-bold leading-tight">{t("home.ctaTitle")}</h2>
            <p className="mt-3 text-sm">{t("home.ctaText")}</p>
            <Link to={sellLink} className="btn mt-6 border-white !px-8 !py-3 text-white hover:bg-white hover:text-gray-900">
              {loggedIn ? t("nav.sellItem") : t("home.ctaRegisterFree")}
            </Link>
          </div>
        </div>
      </section>

      {/* reverse auctions */}
      <section className="container-page pt-16">
        <SectionTitle title={t("nav.reverseAuctions")} to={navRoutes.ENCHERESINVERSES} linkText={t("common.viewAll")} />
        <ProductsListing ventes={encheresInverses} type={navRoutes.ENCHEREINVERSE} limit={4} />
      </section>

      {/* categories */}
      {categories.length > 0 && (
        <section className="container-page pt-16">
          <SectionTitle title={t("home.browseCategories")} to={navRoutes.CATEGORIES} linkText={t("home.allCategories")} />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${c.id}`} className="group block">
                <div className="aspect-square overflow-hidden border border-gray-300 bg-gray-100">
                  <img
                    src={c.image ? `${BACKEND_URL}/category/${c.image}` : `/assets/categories/${c.id}.jpg`}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-bold text-gray-900 group-hover:text-brand-600">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Homepage;
