import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  })
  priority!: TaskPriority;

  @Column({ type: "datetime", nullable: true })
  dueDate!: Date | null;

  // ✅ Task belongs to ONE Category
  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  category?: Category;

  // ✅ Task belongs to ONE User
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user!: User;
}
