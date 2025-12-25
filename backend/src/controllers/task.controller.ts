import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Task } from "../entities/Task";
import { Category } from "../entities/Category";

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const categoryRepo = AppDataSource.getRepository(Category);

    const { categoryId, ...taskData } = req.body;

    // ✅ create empty Task (safe)
    const task = taskRepo.create();
    Object.assign(task, {
      ...taskData,
      user: { id: req.user!.id },
    });

    if (categoryId) {
      const category = await categoryRepo.findOne({
        where: {
          id: categoryId,
          user: { id: req.user!.id },
        },
      });

      if (!category) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      task.category = category;
    }

    await taskRepo.save(task);

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create task",
    });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);

    const tasks = await taskRepo.find({
      where: { user: { id: req.user!.id } },
      order: { id: "DESC" },
    });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOne({
      where: {
        id: taskId,
        user: { id: req.user!.id }, // 🔐 security check
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, ...data } = req.body;

    const taskRepo = AppDataSource.getRepository(Task);
    const categoryRepo = AppDataSource.getRepository(Category);

    const task = await taskRepo.findOne({
      where: { id: Number(id), user: { id: req.user!.id } },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (categoryId !== undefined) {
      if (categoryId === null) {
        task.category = undefined;
      } else {
        const category = await categoryRepo.findOne({
          where: { id: categoryId, user: { id: req.user!.id } },
        });

        if (!category) {
          return res.status(400).json({ message: "Invalid category" });
        }

        task.category = category;
      }
    }

    taskRepo.merge(task, data);
    await taskRepo.save(task);

    return res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update task",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOne({
      where: { id: Number(id), user: { id: req.user!.id } },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await taskRepo.remove(task);

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
};
