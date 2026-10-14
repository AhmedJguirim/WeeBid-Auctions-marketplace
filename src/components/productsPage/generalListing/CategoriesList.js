import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../../config/env";
import { apiRoutes, navRoutes } from "../../../config/routes";
import PageHeader from "../../ui/PageHeader";

export const CategoryTile = ({ category }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Link to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${category.id}`} className="block aspect-[4/3] overflow-hidden border border-gray-300 bg-gray-100">
        <img
          src={category.image ? `${BACKEND_URL}/category/${category.image}` : `/assets/categories/${category.id}.jpg`}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>
      <h3 className="mt-3 font-sans text-base font-bold text-gray-900">{category.name}</h3>
      <div className="mt-1 flex gap-5 text-sm">
        <Link to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${category.id}`} className="underline underline-offset-2 hover:text-brand-600">
          {t("nav.auctions")}
        </Link>
        <Link to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/${category.id}`} className="underline underline-offset-2 hover:text-brand-600">
          {t("categories.reverseShort")}
        </Link>
      </div>
    </div>
  );
};

const CategoriesList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${apiRoutes.API}/categories`)
      .then((response) => setCategories(response["data"]["hydra:member"]))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <PageHeader title={t("nav.categories")} subtitle={t("categories.subtitle")} />
      <div className="container-page grid gap-x-6 gap-y-10 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </div>
    </>
  );
};

export default CategoriesList;
