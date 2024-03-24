import { useUser } from "@/components/hooks/useUser.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRoot } from "@/mst/provider";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export const Overview = observer(() => {
  const root = useRoot();

  const {
    fetchAllTables,
    deleteTableByName,
    tables,
    setSelectedTableByName,
    user: { logout, role, username, authenticated, userId },
  } = root;

  const navigate = useNavigate();

  const initialized = useUser(root);

  useEffect(() => {
    (initialized || userId) && fetchAllTables();
  }, [initialized, authenticated, userId, fetchAllTables]);

  const _deleteTableByName = (tableName?: string) => {
    deleteTableByName(tableName).then((res) => {
      if (res) {
        fetchAllTables();
        toast.success(`Table ${tableName} was deleted`);
      }
    });
  };

  return (
    <>
      <Toaster />
      <div className="h-screen w-screen bg-slate-100">
        <div className="absolute h-16 bg-white shadow-md flex gap-x-3 p-4 w-full justify-end items-center top-0">
          {role === "organization" && (
            <NavLink to="/table-editor">
              <Button variant="link" data-test="create-new-table-button">
                Create new table
              </Button>
            </NavLink>
          )}
          <Button
            variant="link"
            data-test="logout-button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
        <div className="pt-20">
          <div className="flex justify-center text-4xl font-semibold text-slate-600 pt-8">
            Welcome, {username}
          </div>
          {!tables.length && (
            <div className="pt-20 bg-transparent flex w-full flex-col gap-y-4 text-3xl font-semibold text-slate-600 items-center">
              <div>No tables available for you.</div>
              <div>Create some new ones!</div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center items-center space-y-2 m-10">
            {tables?.map(({ schema: { table_name } }, index) => (
              <Card
                key={index}
                className="min-w-[300px] flex flex-col shadow-md items-center"
              >
                <CardHeader>{table_name}</CardHeader>
                <CardContent className="flex flex-row gap-x-2 w-full justify-center">
                  <Button
                    variant="outline"
                    disabled={true}
                    data-test="edit-button"
                  >
                    Edit
                  </Button>
                  <NavLink to={`/${table_name}`}>
                    <Button
                      onClick={() => setSelectedTableByName(table_name)}
                      data-test="see-entries-button"
                    >
                      See entries
                    </Button>
                  </NavLink>
                  <Button
                    data-test="delete-table-button"
                    variant="destructive"
                    onClick={() => _deleteTableByName(table_name)}
                    disabled={role !== "organization"}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
