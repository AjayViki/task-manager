import { useEffect, useState } from "react";
import { Input, Button, Card, message, Form } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../store/thunks/profile.thunks";
import { logout } from "../store/thunks/auth.thunks";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((s) => s.profile);

  const [name, setName] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdate = async () => {
    const res = await dispatch(updateProfile({ name }));

    if (updateProfile.fulfilled.match(res)) {
      message.success(res.payload.message);
    } else {
      message.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      message.error("All fields are required");
      return;
    }

    const res = await dispatch(changePassword(passwords));

    if (changePassword.fulfilled.match(res)) {
      message.success(res.payload.message);
      setPasswords({ currentPassword: "", newPassword: "" });
      dispatch(logout());
    } else {
      message.error(res.payload as string);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* PROFILE CARD */}

      <Card title="My Profile" bordered>
        <Form layout="vertical">
          <Form.Item label="Name" className="mb-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Email" className="mb-6">
            <Input placeholder="Email" value={user?.email} disabled />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" loading={loading} onClick={handleUpdate}>
              Update Profile
            </Button>
          </div>
        </Form>
      </Card>
      {/* CHANGE PASSWORD CARD */}
      <Card title="Change Password" bordered>
        <Form layout="vertical">
          <Form.Item label="Current Password" className="mb-4">
            <Input.Password
              placeholder="Current Password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="New Password" className="mb-6">
            <Input.Password
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="primary"
              danger
              loading={loading}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
