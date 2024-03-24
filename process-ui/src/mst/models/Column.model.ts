import { getNodeId, types } from "mobx-state-tree";

export const Column = types
  .model("Column", {
    name: "",
    type: types.optional(
      types.enumeration(["string", "number", "datetime", "id"]),
      "string"
    ),
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
  }));
