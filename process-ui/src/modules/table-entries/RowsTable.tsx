import { DataTable } from "@/components/ui/DataTable";

import { useRoot } from "@/mst/provider";
import { observer } from "mobx-react-lite";

export const RowsTable = observer(() => {
  const { selectedTable } = useRoot();

  if (!selectedTable) return null;

  const data = JSON.parse(selectedTable.data);

  const columns = selectedTable.schema.columns.map((c) => ({
    accessorKey: c.name,
    header: c.name.toLocaleUpperCase(),
  }));

  return <DataTable data={data} columns={columns} />;
});
