import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoot } from "@/mst/provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { observer } from "mobx-react-lite";
import { Toaster } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const roles = ["organization", "regular_user"];

export const RegisterPage = observer(() => {
  const {
    user: {
      onChangeField,
      username,
      password,
      register,
      login,
      role,
      reset,
      fetchAllOrganizations,
      selected_organization,
      organizations,
    },
  } = useRoot();

  useEffect(() => {
    fetchAllOrganizations();
  }, [fetchAllOrganizations]);

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-slate-100">
      <Toaster />
      <div className="bg-white rounded-lg w-[400px] h-fit py-4 px-6 flex flex-col gap-y-4">
        <div className="text-2xl font-semibold text-slate-800 flex justify-center">
          Register
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

        <div className="flex flex-col gap-y-1">
          <div className="text-sm text-slate-600">Enter a role:</div>
          <Select
            data-test="role-select"
            onValueChange={(value) => {
              onChangeField("role", value);
              onChangeField("selected_organization", undefined);
            }}
            value={role}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem
                  data-test={role + "-select-item"}
                  key={role}
                  value={role}
                >
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {role === "regular_user" && (
          <div className="flex flex-col gap-y-1">
            <div className="text-sm text-slate-600">
              Choose your organization:
            </div>
            <Select
              data-test="organization-select"
              onValueChange={(value) => {
                onChangeField("selected_organization", value);
              }}
              value={selected_organization}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(({ username, userId }) => (
                  <SelectItem
                    data-test={username + "-organization-select-item"}
                    key={userId}
                    value={userId}
                  >
                    {username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-y-1">
          <Button
            onClick={() =>
              register().then((res) => {
                if (!res) {
                  return;
                }

                login().then((res) => {
                  if (!res) return;

                  navigate("/");
                });
              })
            }
            data-test="register-button"
          >
            Register
          </Button>
          <NavLink
            to="/login"
            onClick={reset}
            className="w-full flex justify-center"
          >
            <Button data-test="login-button" variant="link">
              Login
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
});
