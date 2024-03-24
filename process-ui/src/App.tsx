import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Overview } from "./modules/overview/Overview";
import { CreateTableEditor } from "./modules/create-table-editor/CreateTableEditor";
import { LoginPage } from "./modules/auth/LoginPage";
import { TableEntries } from "./modules/table-entries/TableEntries";
import { RegisterPage } from "./modules/auth/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Overview />,
  },
  {
    path: "/table-editor",
    element: <CreateTableEditor />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/:tableName",
    element: <TableEntries />,
  },
]);

const App = observer(() => {
  return <RouterProvider router={router} />;
});

export default App;
