import React from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { apiRoutes, navRoutes } from "../../../config/routes";
import PageHeader from "../../ui/PageHeader";
import Pagination from "../../ui/Pagination";
import Avatar from "../../ui/Avatar";
import EmptyState from "../../ui/EmptyState";

const UserSearchPage = () => {
  const { search } = useParams();
  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);

  React.useEffect(() => setPage(1), [search]);
  React.useEffect(() => {
    axios
      .get(`${apiRoutes.API}/users`, { params: { displayName: search, page } })
      .then((response) => {
        setUsers(response["data"]["hydra:member"]);
        const last = response["data"]["hydra:view"] && response["data"]["hydra:view"]["hydra:last"];
        const match = last && last.match(/page=(\d+)/);
        setPages(match ? parseInt(match[1], 10) : 1);
      })
      .catch((error) => console.log(error));
  }, [search, page]);

  return (
    <>
      <PageHeader title={`Membres : « ${search} »`} subtitle="Résultats de recherche parmi les membres." />
      <div className="container-page py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {users.map((u) => (
            <Link key={u.id} to={`${navRoutes.CONSULTUSER}/${u.id}`} className="card flex flex-col items-center p-6 text-center transition hover:-translate-y-1 hover:shadow-lift">
              <Avatar name={u.displayName} image={u.image} size={72} />
              <p className="mt-3 truncate font-bold text-slate-900">{u.displayName}</p>
            </Link>
          ))}
          {users.length === 0 && <EmptyState title="Aucun membre trouvé" text="Essayez avec un autre nom." />}
        </div>
        <Pagination page={page} count={pages} onChange={setPage} />
      </div>
    </>
  );
};

export default UserSearchPage;
