import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useRoot } from "@/mst/provider";
import { useUser } from "@/components/hooks/useUser.hooks";

const columnTypes = ["string", "number", "datetime", "id"];

export const CreateTableEditor = observer(() => {
  const root = useRoot();

  const {
    new_table: {
      createNew,
      reset,
      addColumn,
      removeColumnById,
      schema: { table_name, onChangeField: onChangeFieldSchema, columns },
    },
    user: { logout, role, userId },
  } = root;

  const navigate = useNavigate();

  if (role !== "organization") {
    navigate("/");
  }

  const onSave = () => {
    createNew(userId).then((res) => {
      if (res) {
        toast.success(`Table ${table_name} was create successfully`);
        reset();
      }
    });
  };

  return (
    <div className="py-20 w-full min-h-screen flex flex-col justify-start items-center bg-slate-100">
      <Toaster />
      <div className="absolute h-16 bg-white shadow-md flex gap-x-3 p-4 w-full justify-end items-center top-0 left-0 right-0">
        <NavLink to="/" data-test="go-back-button">
          <Button variant="link">Go back</Button>
        </NavLink>
        <Button
          data-test="logout-link"
          variant="link"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <div className="w-[800px] flex flex-col gap-y-4 pt-10">
        <div className="text-2xl font-semibold text-slate-800">
          Welcome to the create table editor
        </div>

        <div className="flex flex-col gap-y-2 text-sm font-light text-slate-600">
          <div>Enter new table's name: </div>
          <Input
            data-test="table-name-input"
            value={table_name}
            onChange={(e) => onChangeFieldSchema("table_name", e.target.value)}
          />
        </div>

        <div className="text-sm font-light text-slate-600">
          <div>Enter table columns: </div>
          <div className="w-full rounded-md py-2 flex flex-col gap-y-4">
            {!columns.length && (
              <Button
                className="w-full pt-4"
                onClick={addColumn}
                data-test="add-new-column-button-when-there-are-no-columns"
              >
                Add new column
              </Button>
            )}
            {columns.map((column) => (
              <div
                key={column.id}
                className="rounded-md border-slate-800 border-2 p-4 flex flex-col gap-y-2"
              >
                <div className="w-full flex flex-col gap-y-1">
                  <div>Enter a column's name:</div>
                  <Input
                    data-test={`column-name-input-${column.id}`}
                    value={column.name}
                    onChange={(e) =>
                      column.onChangeField("name", e.target.value)
                    }
                  />
                </div>
                <div className="w-full flex flex-col gap-y-1">
                  <div>Enter a column's type of data:</div>
                  <Select
                    data-test={`column-data-type-input-${column.id}`}
                    onValueChange={(value) => {
                      column.onChangeField("type", value);
                    }}
                    value={column.type}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        data-type={`column-data-type-select-value-${column.id}`}
                        placeholder="Select a type"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {columnTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          data-type={`column-data-type-select-item-${column.id}`}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full pt-4 flex flex-row justify-between gap-x-4">
                  <Button
                    className="w-full pt-4"
                    onClick={addColumn}
                    data-test={`add-column-button-${column.id}`}
                  >
                    Add new column
                  </Button>
                  <Button
                    className="w-full pt-4"
                    onClick={() => removeColumnById(column.id)}
                    variant="destructive"
                    data-test={`remove-column-button-${column.id}`}
                  >
                    Remove column
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex flex-row items-center pt-4 justify-end"></div>
          <Button onClick={onSave} data-test="save-table-button">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
});
