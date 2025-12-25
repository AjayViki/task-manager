import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Category } from "../entities/Category";

export const getCategories = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Category);

  const categories = await repo.find({
    where: { user: { id: req.user!.id } },
    order: { id: "DESC" },
  });

  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryRepo = AppDataSource.getRepository(Category);

    const existing = await categoryRepo.findOne({
      where: {
        name: req.body.name,
        user: { id: req.user!.id },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = categoryRepo.create({
      name: req.body.name,
      user: { id: req.user!.id },
    });

    await categoryRepo.save(category);

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create category",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryRepo = AppDataSource.getRepository(Category);

    const category = await categoryRepo.findOne({
      where: { id: Number(id), user: { id: req.user!.id } },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await categoryRepo.remove(category);

    return res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete category",
    });
  }
};
