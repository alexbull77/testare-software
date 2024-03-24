import { flow, types as t, toGenerator } from "mobx-state-tree";
import { Table } from "../models/Table.model";
import axios, { AxiosError } from "axios";
import { User } from "../models/User.model";

export const Root = t
  .model("Root", {
    tables: t.array(Table),
    new_table: t.optional(Table, {}),
    selected_table_name: t.maybe(t.string),
    user: t.optional(User, {}),
  })
  .actions((self) => ({
    fetchAllTables: flow(function* () {
      const ownerId =
        self.user.role === "organization"
          ? self.user.userId
          : self.user.selected_organization;

      if (!ownerId?.length) return;

      try {
        const res = yield* toGenerator(
          axios.get(`http://localhost:3000/dynamic-tables/get-all/${ownerId}`, {
            headers: { Authorization: `Bearer ${self.user.access_token}` },
          })
        );

        if (!res || !res?.data?.length) return;

        self.tables = res.data.map((table: any) => ({
          schema: table.schema,
          data: JSON.stringify(table.data),
        }));
      } catch (e: any) {
        const error: AxiosError = e;
        if (error?.response?.status === 401) {
          self.user.onChangeField("authenticated", false);
        }
        console.error(e);
      }
    }),

    deleteTableByName: flow(function* (tableName?: string) {
      if (!tableName) return;

      try {
        const res: string = yield* toGenerator(
          axios({
            method: "post",
            url: `http://localhost:3000/dynamic-tables/drop/${tableName}`,
            headers: {},
          })
        );

        return res;
      } catch (e) {
        console.error(e);
      }
    }),

    setSelectedTableByName(name: string) {
      self.selected_table_name = name;
    },

    resetSelectedTableById() {
      self.selected_table_name = undefined;
    },
  }))
  .views((self) => ({
    get selectedTable() {
      return self.tables.find(
        (t) => t.schema.table_name === self.selected_table_name
      );
    },
  }));
