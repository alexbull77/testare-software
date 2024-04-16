import {
  applySnapshot,
  flow,
  getNodeId,
  types as t,
  toGenerator,
} from "mobx-state-tree";
import { Schema } from "./Schema.model";
import axios from "axios";
import toast from "react-hot-toast";

export const Table = t
  .model("Root", {
    schema: t.optional(Schema, {}),
    // cannot really explicitly type it
    data: "",
  })
  .views((self) => ({
    get id() {
      return getNodeId(self);
    },
  }))
  .actions((self) => ({
    onChangeField<Keys extends keyof typeof self>(
      field: Keys,
      value: (typeof self)[Keys]
    ) {
      self[field] = value;
    },
  }))
  .actions((self) => ({
    createNew: flow(function* (ownerId: string) {
      try {
        const res = yield* toGenerator(
          axios({
            method: "post",
            url: "http://localhost:3000/dynamic-tables/create",
            headers: {},
            data: {
              table_name: self.schema.table_name,
              ownerId,
              columns: self.schema.columns,
            },
          })
        );

        return res;
      } catch (e) {
        toast.error(e.response.data.message);
        console.error(e);
        return;
      }
    }),

    reset() {
      applySnapshot(self, {});
    },

    addColumn() {
      self.schema.columns.push({});
    },

    removeColumnById(columnId: number) {
      const selectedColumn = self.schema.columns.find((c) => c.id === columnId);

      if (!selectedColumn) throw new Error("Not column found!");

      self.schema.columns.remove(selectedColumn);
    },

    insertNewEntry: flow(function* (data: any) {
      try {
        const res = yield* toGenerator(
          axios({
            method: "post",
            url: `http://localhost:3000/dynamic-tables/insert/${self.schema.table_name}`,
            headers: {},
            data: { entry: data },
          })
        );

        return res;
      } catch (e) {
        console.error(e);
      }
    }),
  }));
