import { useState } from "react";
import { Card, Input, Button, List, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
} from "../store/thunks/category.thunks";

import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function CategoryManager() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.list);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  /* ===== Handlers ===== */

  const handleCreate = async () => {
    if (!name.trim()) {
      message.error("Category name is required");
      return;
    }

    try {
      const res = await dispatch(createCategory(name)).unwrap();

      message.success(res.message); // 👈 backend message
      setName("");
      setOpen(false);
    } catch (error: any) {
      message.error(error);
    }
  };

  const { confirm } = Modal;
  const handleDeleteCategory = (id: number) => {
    confirm({
      title: "Delete Category",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this category? Tasks under this category will be uncategorized.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      async onOk() {
        try {
          const res = await dispatch(deleteCategory(id)).unwrap();
          dispatch(fetchCategories());
          message.success(res.message);
        } catch (error: any) {
          message.error(error || "Failed to delete category");
        }
      },
    });
  };

  /* ===== UI ===== */

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card
        title="Categories"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Add Category
          </Button>
        }
      >
        <List
          dataSource={categories}
          locale={{ emptyText: "No categories yet" }}
          renderItem={(c) => (
            <List.Item
              actions={[
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteCategory(c.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              {c.name}
            </List.Item>
          )}
        />
      </Card>

      {/* CREATE MODAL */}
      <Modal
        title="Add Category"
        open={open}
        onOk={handleCreate}
        onCancel={() => {
          setOpen(false);
          setName("");
        }}
        okText="Add"
      >
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleCreate}
          autoFocus
        />
      </Modal>
    </div>
  );
}
