import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoot } from "@/mst/provider";
import { observer } from "mobx-react-lite";
import { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

export const LoginPage = observer(() => {
  const {
    user: { onChangeField, username, password, login, reset },
  } = useRoot();

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <Toaster />
      <div className="bg-white rounded-lg w-[400px] h-fit py-4 px-6 flex flex-col gap-y-4">
        <div className="text-2xl font-semibold text-slate-800 flex justify-center">
          Login
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="text-sm text-slate-600">Username</div>
          <Input
            data-test="username-input"
            value={username}
            onChange={(e) => onChangeField("username", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="text-sm text-slate-600">Password</div>
          <Input
            data-test="password-input"
            value={password}
            onChange={(e) => onChangeField("password", e.target.value)}
            type="password"
          />
        </div>
        <Button
          onClick={() =>
            login().then((res) => {
              if (!res) {
                return;
              }

              navigate("/");
            })
          }
          data-test="login-button"
        >
          Login
        </Button>
        <NavLink
          to="/register"
          onClick={reset}
          className="w-full flex justify-center"
        >
          <Button variant="link" data-test="register-button">
            Register
          </Button>
        </NavLink>
      </div>
    </div>
  );
});
