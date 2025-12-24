import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    default: "Pending",
  })
  status!: "Pending" | "In Progress" | "Completed";

  @Column({
    default: "Medium",
  })
  priority!: "Low" | "Medium" | "High";

  @Column({ type: "date", nullable: true })
  dueDate!: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user!: User;
}
