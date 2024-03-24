import { types } from "mobx-state-tree";
import { Column } from "./Column.model";

export const Schema = types
  .model("Schema", {
    table_name: "",
    columns: types.array(Column),
  })
  .actions((self) => ({
    onChangeField<Keys extends keyof typeof self>(
      field: Keys,
      value: (typeof self)[Keys]
    ) {
      self[field] = value;
    },
  }));
