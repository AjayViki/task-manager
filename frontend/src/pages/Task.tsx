import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Input,
  Select,
  message,
  DatePicker,
  Form,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { orderBy, filter } from "lodash";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
  fetchTaskById,
} from "../store/thunks/task.thunks";
import { fetchCategories } from "../store/thunks/category.thunks";
import { logout } from "../store/thunks/auth.thunks";

import {
  Category,
  Task,
  TaskForm,
  TaskPriority,
} from "../store/types/task.types";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { tasks, loading, selectedTask } = useAppSelector(
    (state) => state.tasks
  );
  const categories = useAppSelector(
    (state) => state.categories.list
  ) as Category[];

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<TaskForm>({
    title: "",
    priority: "Medium",
    status: "Pending",
    dueDate: null,
    categoryId: null,
  });

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "In Progress" | "Completed"
  >("All");

  const [priorityFilter, setPriorityFilter] = useState<
    "All" | "Low" | "Medium" | "High"
  >("All");

  const [categoryFilter, setCategoryFilter] = useState<number | "All">("All");

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchCategories());
  }, [dispatch]);

  /* ===== EDIT MODE ===== */
  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title,
        priority: selectedTask.priority,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate ?? null,
        categoryId: selectedTask.category?.id ?? null,
      });
    }
  }, [selectedTask]);

  /* ===== HELPERS ===== */
  const updateForm = <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      priority: "Medium",
      status: "Pending",
      dueDate: null,
      categoryId: null,
    });
    setIsEdit(false);
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      message.error("Title is required");
      return false;
    }

    if (form.dueDate && dayjs(form.dueDate).isBefore(dayjs(), "day")) {
      message.error("Due date cannot be in the past");
      return false;
    }

    return true;
  };

  /* ===== CRUD ===== */
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const res = await dispatch(createTask(form)).unwrap();
      dispatch(fetchTasks());
      message.success(res.message); // 👈 backend message
      setOpen(false);
      resetForm();
    } catch (error: any) {
      message.error(error);
    }
  };

  const handleEdit = async (id: number) => {
    setIsEdit(true);
    setOpen(true);
    await dispatch(fetchTaskById(id));
  };

  const handleUpdate = async () => {
    if (!selectedTask || !validateForm()) return;

    try {
      const res = await dispatch(
        updateTask({
          id: selectedTask.id,
          data: form,
        })
      ).unwrap();
      dispatch(fetchTasks());
      message.success(res.message); // 👈 backend message
      setOpen(false);
      resetForm();
    } catch (error: any) {
      message.error(error);
    }
  };

  const { confirm } = Modal;

  const handleDelete = (id: number) => {
    confirm({
      title: "Delete Task",
      content: "Are you sure you want to delete this task?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      async onOk() {
        try {
          const res = await dispatch(deleteTask(id)).unwrap();
          dispatch(fetchTasks());
          message.success(res.message);
        } catch (error: any) {
          message.error(error || "Failed to delete task");
        }
      },
    });
  };

  /* ===== FILTERING ===== */
  const filteredTasks = filter(tasks, (task: Task) => {
    if (statusFilter !== "All" && task.status !== statusFilter) return false;
    if (priorityFilter !== "All" && task.priority !== priorityFilter)
      return false;
    if (categoryFilter !== "All" && task.category?.id !== categoryFilter)
      return false;

    return true;
  });

  // const sortedTasks = orderBy(
  //   filteredTasks,
  //   [(task: Task) => task.dueDate || ""],
  //   ["asc"]
  // );

  const priorityOrder: Record<TaskPriority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  /* ===== TABLE ===== */
  const columns: ColumnsType<Task> = [
    { title: "Title", dataIndex: "title" },

    {
      title: "Category",
      dataIndex: ["category", "name"],
      render: (name?: string) => name ?? "—",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },

    {
      title: "Priority",
      dataIndex: "priority",
      sorter: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      render: (priority) => (
        <Tag
          color={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "blue"
              : "gray"
          }
        >
          {priority}
        </Tag>
      ),
    },

    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime(),
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "—"),
    },

    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Space size="middle" wrap>
            <Button size="small" onClick={() => handleEdit(record.id)}>
              Edit
            </Button>
            <Button danger size="small" onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </Space>
        </>
      ),
    },
  ];

  /* ===== UI ===== */
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Space size="middle" wrap>
            <h1 className="text-2xl font-semibold text-gray-800">My Tasks</h1>

            <Button
              type="primary"
              onClick={() => {
                setForm({
                  title: "",
                  priority: "Medium",
                  status: "Pending",
                  dueDate: null,
                  categoryId: null,
                });
                setOpen(true);
              }}
            >
              + New Task
            </Button>
          </Space>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* LEFT: NEW TASK BUTTON */}

            {/* RIGHT: FILTERS */}
            <Form layout="inline">
              <Space size="middle" wrap>
                <Form.Item>
                  <Select
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    placeholder="Category"
                    style={{ width: 180 }}
                  >
                    <Select.Option value="All">All Categories</Select.Option>
                    {categories.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Status"
                    style={{ width: 160 }}
                  >
                    <Select.Option value="All">All Status</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="In Progress">
                      In Progress
                    </Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Select
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    placeholder="Priority"
                    style={{ width: 160 }}
                  >
                    <Select.Option value="All">All Priority</Select.Option>
                    <Select.Option value="Low">Low</Select.Option>
                    <Select.Option value="Medium">Medium</Select.Option>
                    <Select.Option value="High">High</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    onClick={() => {
                      setCategoryFilter("All");
                      setStatusFilter("All");
                      setPriorityFilter("All");
                    }}
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mt-6">
          <Table
            rowKey="id"
            dataSource={filteredTasks}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 8 }}
          />
        </div>

        {/* MODAL */}
        <Modal
          title={isEdit ? "Edit Task" : "Create Task"}
          open={open}
          onOk={isEdit ? handleUpdate : handleCreate}
          onCancel={() => {
            setOpen(false);
            resetForm();
          }}
        >
          <Form layout="vertical">
            <Form.Item>
              <Input
                placeholder="Task title"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item>
                <Select
                  value={form.categoryId ?? undefined}
                  onChange={(v) => updateForm("categoryId", v)}
                  placeholder="Select Category"
                  allowClear
                >
                  {categories.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Select
                  value={form.status}
                  onChange={(v) => updateForm("status", v)}
                >
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item>
                <Select
                  value={form.priority}
                  onChange={(v) => updateForm("priority", v)}
                >
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <DatePicker
                  value={form.dueDate ? dayjs(form.dueDate) : null}
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  onChange={(date) =>
                    updateForm("dueDate", date ? date.toISOString() : null)
                  }
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Tasks;
