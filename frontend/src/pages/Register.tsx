import { useState } from "react";
import { Card, Input, Button, message } from "antd";
import { useAppDispatch } from "../store/hooks";
import { registerUser } from "../store/thunks/auth.thunks";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    debugger;
    if (!form.name || !form.email || !form.password) {
      message.error("All fields are required");
      return;
    }

    if (!isValidEmail(form.email)) {
      message.error("Please enter a valid email address");
      return;
    }

    const res = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(res)) {
      message.success("Registration successful");
      navigate("/login", { replace: true });
    } else {
      message.error(res.payload as string);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Create Account" className="w-[400px]">
        <Form layout="vertical">
          <Form.Item>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Input.Password
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </Form.Item>

          <Button type="primary" block onClick={handleRegister}>
            Register
          </Button>
          <Button type="link" block onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
