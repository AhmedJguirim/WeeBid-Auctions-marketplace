import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { apiRoutes, navRoutes } from "../../../config/routes";
import ProductsListing from "../../generalComponents/ProductsListing";
import PageHeader from "../../ui/PageHeader";

const WatchList = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const [encheres, setEncheres] = React.useState([]);
  const [encheresInverses, setEncheresInverses] = React.useState([]);

  React.useEffect(() => {
    if (user.id === undefined) return;
    axios
      .get(`${apiRoutes.API}/surveilles`, { params: { page: "1", user: user.id } })
      .then((response) => {
        const list = response["data"]["hydra:member"];
        setEncheres(list.filter((s) => s.enchere).map((s) => s.enchere));
        setEncheresInverses(list.filter((s) => !s.enchere && s.enchereInverse).map((s) => s.enchereInverse));
      })
      .catch((error) => console.log(error));
  }, [user]);

  return (
    <>
      <PageHeader title={t("userMenu.watchlist")} subtitle={t("watch.subtitle")} />
      <div className="container-page space-y-12 py-8">
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">{t("watch.auctions")}</h2>
          <ProductsListing type={navRoutes.ENCHERE} ventes={encheres} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">{t("watch.reverse")}</h2>
          <ProductsListing type={navRoutes.ENCHEREINVERSE} ventes={encheresInverses} />
        </section>
      </div>
    </>
  );
};

export default WatchList;
