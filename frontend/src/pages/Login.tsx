import { Card, Input, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login } from "../store/thunks/auth.thunks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/task", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    const res = await dispatch(login({ email, password }));

    if (login.fulfilled.match(res)) {
      message.success("Login successful");
      navigate("/");
    } else {
      message.error("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card title="Login" className="w-96">
        <Input
          placeholder="Email"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input.Password
          placeholder="Password"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="primary" block loading={loading} onClick={handleLogin}>
          Login
        </Button>
        <Button type="link" block onClick={() => navigate("/register")}>
          Register
        </Button>
      </Card>
    </div>
  );
};

export default Login;
