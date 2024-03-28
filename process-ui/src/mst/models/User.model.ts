import axios from "axios";
import { applySnapshot, flow, toGenerator, types } from "mobx-state-tree";
import toast from "react-hot-toast";
import { del } from "idb-keyval";

export const User = types
  .model({
    userId: "",
    username: "",
    password: "",
    access_token: "",
    authenticated: false,
    role: types.optional(
      types.enumeration(["organization", "regular_user"]),
      "organization"
    ),
    selected_organization: types.maybe(types.string),
    organizations: types.array(types.model({ username: "", userId: "" })),
  })
  .actions((self) => ({
    onChangeField<Keys extends keyof typeof self>(
      field: Keys,
      value: (typeof self)[Keys]
    ) {
      self[field] = value;
    },

    register: flow(function* () {
      try {
        const res = yield* toGenerator(
          axios({
            method: "post",
            url: "http://localhost:3000/auth/register",
            headers: {},
            data: {
              username: self.username,
              password: self.password,
              role: self.role,
              selected_organization: self.selected_organization,
            },
          })
        );

        return res.data;
      } catch (e: any) {
        toast.error(e.response.data.message);
        console.error(e);
        return;
      }
    }),

    login: flow(function* () {
      try {
        const res = yield* toGenerator(
          axios({
            method: "post",
            url: "http://localhost:3000/auth/login",
            headers: {},
            data: {
              username: self.username,
              password: self.password,
            },
          })
        );

        if (!res) {
          return;
        }

        self.userId = res.data.userId;
        self.role = res.data.role;
        self.selected_organization = res.data?.selected_organization;

        self.access_token = res.data.access_token;
        self.authenticated = true;

        return "success";
      } catch (e: any) {
        toast.error(e.response.data.message);
        console.error(e);
        return;
      }
    }),

    fetchAllOrganizations: flow(function* () {
      try {
        const res = yield* toGenerator(
          axios({
            method: "get",
            url: "http://localhost:3000/auth/organizations",
            headers: {},
          })
        );

        self.organizations = res.data;
      } catch (e: any) {
        toast.error(e.response.data.message);
        console.error(e);
        return;
      }
    }),

    logout() {
      applySnapshot(self, {});
      del("user");
    },

    reset() {
      applySnapshot(self, {});
    },
  }));
