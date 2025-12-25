import { useState } from "react";
import { Card, Input, Button, message } from "antd";
import { useAppDispatch } from "../store/hooks";
import { registerUser } from "../store/thunks/auth.thunks";
import { useNavigate } from "react-router-dom";

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

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      message.error("All fields are required");
      return;
    }

    const res = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(res)) {
      message.success("Registration successful");
      //   navigate("/task");
    } else {
      message.error(res.payload as string);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card title="Create Account" className="w-[400px]">
        <div className="space-y-4">
          <Input
            placeholder="Name"
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Email"
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input.Password
            placeholder="Password"
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <Button type="primary" block onClick={handleRegister}>
            Register
          </Button>
          <Button type="link" block onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </div>
      </Card>
    </div>
  );
}
