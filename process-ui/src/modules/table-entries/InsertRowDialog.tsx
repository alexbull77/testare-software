import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRoot } from "@/mst/provider";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const InsertRowDialog = observer(() => {
  const { selectedTable, fetchAllTables } = useRoot();
  const [lastId, setLastId] = useState(1);

  useEffect(() => {
    if (!selectedTable?.data) return;

    const parsedData = JSON.parse(selectedTable?.data);
    const lastRow = parsedData[parsedData.length - 1];

    if (!lastRow) return;

    const idColumnPresent = Object.keys(lastRow).includes("id");

    if (!idColumnPresent) return;

    setLastId(lastRow.id + 1);
  }, [selectedTable?.data]);

  const initialState =
    selectedTable?.schema?.columns?.map(({ name, type }) => ({
      name,
      type,
      value: "",
    })) || [];

  const [newRowItems, setNewRowItems] = useState(initialState || []);

  const [open, setOpen] = useState(false);

  const onChangeRowItemValueByName = (name: string, value: string) => {
    setNewRowItems(
      newRowItems?.map((item) => {
        if (item.name !== name) return item;

        return {
          ...item,
          value,
        };
      })
    );
  };

  if (!selectedTable) return null;

  const getPreparedData = () => {
    const jsonObject: { [key: string]: any } = {};
    newRowItems.forEach(({ name, value }) => {
      if (name === "id") {
        jsonObject[name] = lastId;
        return;
      }
      jsonObject[name] = value;
    });
    return jsonObject;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />
      <div className="w-full flex justify-center p-y-4">
        <DialogTrigger className="w-fit">
          <div className="w-fit">
            <Button size="lg" data-test="insert-new-row-button">
              Insert new row
            </Button>
          </div>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert new row</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-4 pt-8">
          {newRowItems.map(({ name, type, value }) => {
            if (type !== "id") {
              return (
                <div key={name} className="flex flex-col gap-y-2 w-full">
                  <div>{name}</div>
                  <Input
                    value={value}
                    onChange={(e) =>
                      onChangeRowItemValueByName(name, e.target.value)
                    }
                    type={
                      type === "string"
                        ? "text"
                        : type === "datetime"
                        ? "datetime-local"
                        : "number"
                    }
                    data-test={`${name}-${type}-input`}
                  />
                </div>
              );
            }
          })}
        </div>

        <div className="w-full flex justify-end">
          <Button
            data-test="save-new-row-button"
            onClick={() =>
              selectedTable.insertNewEntry(getPreparedData()).then((res) => {
                if (res) {
                  toast.success("Row inserted");
                  setNewRowItems(initialState);
                  fetchAllTables();
                  setOpen(false);
                }
              })
            }
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
