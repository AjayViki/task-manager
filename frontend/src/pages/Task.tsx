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
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
  fetchTaskById,
} from "../store/thunks/task.thunks";
import { logout } from "../store/thunks/auth.thunks";
import { Task, TaskForm, TaskPriority } from "../store/types/task.types";
import type { ColumnsType } from "antd/es/table";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { tasks, loading, selectedTask } = useAppSelector(
    (state) => state.tasks
  );

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<TaskForm>({
    title: "",
    priority: "Medium",
    status: "Pending",
    dueDate: null,
  });

  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "In Progress" | "Completed"
  >("All");

  const [priorityFilter, setPriorityFilter] = useState<
    "All" | "Low" | "Medium" | "High"
  >("All");

  /* 🔹 Load tasks */
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  /* 🔹 Populate form on edit */
  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title,
        priority: selectedTask.priority,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate ?? null,
      });
    }
  }, [selectedTask]);

  /* 🔹 Helper to update form safely */
  const updateForm = <K extends keyof TaskForm>(key: K, value: TaskForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      priority: "Medium",
      status: "Pending",
      dueDate: null,
    });
    setIsEdit(false);
  };

  /* ===== CRUD ===== */

  const validateForm = () => {
    if (!form.title.trim()) {
      message.error("Title is required");
      return false;
    }

    if (!form.priority) {
      message.error("Priority is required");
      return false;
    }

    if (!form.status) {
      message.error("Status is required");
      return false;
    }

    // ✅ Due Date validation
    if (form.dueDate && dayjs(form.dueDate).isBefore(dayjs(), "day")) {
      message.error("Due date cannot be in the past");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    await dispatch(createTask(form));
    setOpen(false);
    resetForm();
    message.success("Task created");
  };

  const handleEdit = async (id: number) => {
    setIsEdit(true);
    setOpen(true);
    await dispatch(fetchTaskById(id));
  };

  const handleUpdate = async () => {
    if (!selectedTask) return;
    if (!validateForm()) return;
    console.log(form);
    await dispatch(
      updateTask({
        id: selectedTask.id,
        data: form,
      })
    );

    setOpen(false);
    resetForm();
    message.success("Task updated");
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteTask(id));
    message.success("Task deleted");
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  /* ===== TABLE ===== */

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "All" || task.status === statusFilter;

    const priorityMatch =
      priorityFilter === "All" || task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  const isOverdue = (task: Task) =>
    task.dueDate &&
    task.status !== "Completed" &&
    dayjs(task.dueDate).isBefore(dayjs(), "day");

  const priorityOrder: Record<TaskPriority, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const columns: ColumnsType<Task> = [
    { title: "Title", dataIndex: "title" },

    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },

    {
      title: "Priority",
      dataIndex: "priority",
      sorter: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      render: (priority: TaskPriority) => (
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
          <Button size="small" onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="space-x-2">
          <Button type="primary" onClick={() => setOpen(true)}>
            + New Task
          </Button>
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="All">All Status</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
        </Select>

        <Select
          value={priorityFilter}
          onChange={setPriorityFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="All">All Priority</Select.Option>
          <Select.Option value="Low">Low</Select.Option>
          <Select.Option value="Medium">Medium</Select.Option>
          <Select.Option value="High">High</Select.Option>
        </Select>

        <Button
          onClick={() => {
            setStatusFilter("All");
            setPriorityFilter("All");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={filteredTasks}
        columns={columns}
        loading={loading}
        rowClassName={(record) => (isOverdue(record) ? "bg-red-50" : "")}
      />

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
        <Input
          placeholder="Task title"
          className="mb-3"
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
        />

        <Select
          value={form.priority}
          onChange={(v) => updateForm("priority", v)}
          className="mb-3 w-full"
        >
          <Select.Option value="Low">Low</Select.Option>
          <Select.Option value="Medium">Medium</Select.Option>
          <Select.Option value="High">High</Select.Option>
        </Select>

        <Select
          value={form.status}
          onChange={(v) => updateForm("status", v)}
          className="mb-3 w-full"
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
        </Select>

        <DatePicker
          value={form.dueDate ? dayjs(form.dueDate) : null}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
          onChange={(date) =>
            updateForm("dueDate", date ? date.toISOString() : null)
          }
          className="w-full"
        />
      </Modal>
    </div>
  );
};

export default Tasks;
