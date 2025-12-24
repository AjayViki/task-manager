import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Category } from "../entities/Category";

export const getCategories = async (_: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Category);
  const categories = await repo.find();
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  const repo = AppDataSource.getRepository(Category);
  const exists = await repo.findOne({ where: { name } });

  if (exists) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = repo.create({ name });
  await repo.save(category);

  res.status(201).json(category);
};
