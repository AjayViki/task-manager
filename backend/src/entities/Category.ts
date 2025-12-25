import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // ✅ Category belongs to ONE User
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE",
  })
  user!: User;

  // ✅ Category has MANY Tasks
  @OneToMany(() => Task, (task) => task.category)
  tasks!: Task[];
}
