import { Instance } from "mobx-state-tree";
import { Root } from "./stores/Root.store";
import { Column } from "./models/Column.model";
import { Schema } from "./models/Schema.model";
import { Table } from "./models/Table.model";

export interface IRoot extends Instance<typeof Root> {}

export interface IColumn extends Instance<typeof Column> {}

export interface ISchema extends Instance<typeof Schema> {}

export interface ITable extends Instance<typeof Table> {}
