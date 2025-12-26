import { Card, Input, Button, message, Form } from "antd";
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
    if (!email || !password) {
      message.error("Email and password are required");
      return;
    }

    const res = await dispatch(login({ email, password }));

    if (login.fulfilled.match(res)) {
      message.success("Login successful");
      navigate("/task", { replace: true });
    } else {
      message.error("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card title="Login" className="w-96">
        <Form layout="vertical">
          <Form.Item>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Button type="primary" block loading={loading} onClick={handleLogin}>
            Login
          </Button>

          <Button type="link" block onClick={() => navigate("/register")}>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
