import React from "react";
import Api from "../../AxiosInstance";
import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";

/**
 * Table fed by a paginated API endpoint with a "load more" button.
 * `columns`: [{ header, cell(row), align }]; `rows` mapping is done by the caller through `map`.
 */
const PagedTable = ({ title, subtitle, endpoint, params, enabled = true, columns, emptyText }) => {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const paramsKey = JSON.stringify(params);

  React.useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    Api.get(endpoint, { params: { page, ...params, "order[date]": "desc" } })
      .then((res) => {
        const members = res.data["hydra:member"];
        setRows((prev) => (page === 1 ? members : [...prev, ...members]));
        setHasMore(members.length === 15);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramsKey, page, enabled]);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="container-page py-8">
        {rows.length === 0 && !loading ? (
          <EmptyState title="Rien pour le moment" text={emptyText} />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {columns.map((c) => (
                      <th key={c.header} className={`px-5 py-3 font-semibold ${c.align === "right" ? "text-right" : ""}`}>{c.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.id} className="transition hover:bg-slate-50/70">
                      {columns.map((c) => (
                        <td key={c.header} className={`px-5 py-3.5 ${c.align === "right" ? "text-right" : ""}`}>{c.cell(row)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMore && (
              <button onClick={() => setPage(page + 1)} className="w-full border-t border-slate-100 py-3.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
                Afficher plus
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export const dateLabel = (d) => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default PagedTable;
