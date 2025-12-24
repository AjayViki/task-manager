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

  // ✅ FIXED
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

  @Column({ type: "date", nullable: true })
  dueDate!: string | null;

  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
    eager: true,
    onDelete: "SET NULL",
  })
  category?: Category;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user!: User;
}
