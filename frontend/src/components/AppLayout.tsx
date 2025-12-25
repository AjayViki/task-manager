import { Layout, Menu, Button, Space } from "antd";
import {
  UnorderedListOutlined,
  TagsOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/thunks/auth.thunks";

const { Header, Content } = Layout;

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedKey = location.pathname.startsWith("/categories")
    ? "/categories"
    : "/task";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT MENU */}
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "/task",
              icon: <UnorderedListOutlined />,
              label: "Tasks",
              onClick: () => navigate("/task"),
            },
            {
              key: "/categories",
              icon: <TagsOutlined />,
              label: "Categories",
              onClick: () => navigate("/categories"),
            },
          ]}
          style={{ flex: 1 }}
        />

        {/* RIGHT ACTIONS */}
        <Space>
          <Button icon={<UserOutlined />} onClick={() => navigate("/profile")}>
            Profile
          </Button>

          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={() => dispatch(logout())}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content className="p-6 bg-gray-50">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
