import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BACKEND_URL } from "../../../config/env";
import { apiRoutes, navRoutes } from "../../../config/routes";
import PageHeader from "../../ui/PageHeader";

export const CategoryTile = ({ category }) => (
  <div className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-500 to-brand-800">
      {category.image && (
        <img
          src={`${BACKEND_URL}/category/${category.image}`}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
      <h3 className="absolute bottom-3 left-4 text-xl font-extrabold text-white drop-shadow">{category.name}</h3>
    </div>
    <div className="grid grid-cols-2 divide-x divide-slate-100 text-sm font-semibold">
      <Link to={`${navRoutes.ENCHERES}${navRoutes.PERCATEGORY}/${category.id}`} className="flex items-center justify-center gap-1.5 py-3 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700">
        Enchères <ArrowRight size={14} />
      </Link>
      <Link to={`${navRoutes.ENCHERESINVERSES}${navRoutes.PERCATEGORY}/${category.id}`} className="flex items-center justify-center gap-1.5 py-3 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700">
        Inversées <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);

const CategoriesList = () => {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${apiRoutes.API}/categories`)
      .then((response) => setCategories(response["data"]["hydra:member"]))
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <PageHeader title="Catégories" subtitle="Parcourez le catalogue par univers : électronique, mode, maison, sport…" />
      <div className="container-page grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </div>
    </>
  );
};

export default CategoriesList;
