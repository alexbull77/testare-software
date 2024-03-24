import { Button } from "@/components/ui/button";
import { useRoot } from "@/mst/provider";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { InsertRowDialog } from "./InsertRowDialog";
import { observer } from "mobx-react-lite";
import { RowsTable } from "./RowsTable";
import { useUser } from "@/components/hooks/useUser.hooks";

export const TableEntries = observer(() => {
  const root = useRoot();

  const {
    selected_table_name,
    fetchAllTables,
    setSelectedTableByName,
    user: { logout },
  } = root;

  const navigate = useNavigate();

  const location = useLocation();

  const initialized = useUser(root);

  useEffect(() => {
    initialized &&
      fetchAllTables().then(() => {
        setSelectedTableByName(location.pathname.split("/")[1]);
      });
  }, [fetchAllTables, location.pathname, setSelectedTableByName, initialized]);

  if (!selected_table_name) return;

  return (
    <div className="py-20 w-full min-h-screen flex flex-col justify-start items-center bg-slate-100">
      <Toaster />
      <div className="absolute h-16 bg-white shadow-md flex gap-x-3 p-4 w-full justify-end items-center top-0 left-0 right-0">
        <NavLink to="/">
          <Button variant="link" data-test="go-back-button">
            Go back
          </Button>
        </NavLink>
        <Button
          variant="link"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          data-test="logout-button"
        >
          Logout
        </Button>
      </div>
      <div className="px-40 flex flex-col gap-y-4 justify-center">
        <InsertRowDialog />
        <RowsTable />
      </div>
    </div>
  );
});
