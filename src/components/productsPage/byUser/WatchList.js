import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { apiRoutes, navRoutes } from "../../../config/routes";
import ProductsListing from "../../generalComponents/ProductsListing";
import PageHeader from "../../ui/PageHeader";

const WatchList = () => {
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
      <PageHeader title="Ma liste de surveillance" subtitle="Les enchères que vous suivez. Vous êtes notifié à chaque nouvelle offre." />
      <div className="container-page space-y-12 py-8">
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">Enchères surveillées</h2>
          <ProductsListing type={navRoutes.ENCHERE} ventes={encheres} />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">Enchères inversées surveillées</h2>
          <ProductsListing type={navRoutes.ENCHEREINVERSE} ventes={encheresInverses} />
        </section>
      </div>
    </>
  );
};

export default WatchList;
