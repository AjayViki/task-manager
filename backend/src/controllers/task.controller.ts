import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Task } from "../entities/Task";

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);

    const task = taskRepo.create({
      ...req.body,
      user: { id: req.user!.id }, // req.user added by auth middleware
    });

    await taskRepo.save(task);

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task" });
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const { id } = req.params;

    const task = await taskRepo.findOne({
      where: {
        id: Number(id),
        user: { id: req.user!.id },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    taskRepo.merge(task, req.body);
    await taskRepo.save(task);

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskRepo = AppDataSource.getRepository(Task);
    const { id } = req.params;

    const task = await taskRepo.findOne({
      where: {
        id: Number(id),
        user: { id: req.user!.id },
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRepo.remove(task);

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
