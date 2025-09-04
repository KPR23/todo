"use client";

import { AddTaskForm } from "@/components/Todo/add-task-form";
import TodoList from "@/components/Todo/todo-list";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { FilterIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function Home() {
	const [showAddTask, setShowAddTask] = useState(false);
	const todos = useQuery(api.todos.getTodos) || [];
	const completedTodos = todos.filter((todo) => todo.isCompleted);
	const incompletedTodos = todos.filter((todo) => !todo.isCompleted);
	const projects = useQuery(api.projects.getProjects) || [];
	const labels = useQuery(api.labels.getLabels) || [];

	return (
		<main className="flex flex-col p-6 grow">
			<div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
				<div className="flex justify-between items-center">
					<h1 className="text-lg md:text-2xl font-semibold">Home</h1>
					<div className="flex gap-2">
						<Button onClick={() => setShowAddTask(true)} disabled={showAddTask}>
							<PlusIcon className="w-4 h-4" />
							Add task
						</Button>
						<Button variant="outline">
							<FilterIcon className="w-4 h-4" />
							Filters
						</Button>
					</div>
				</div>
				<hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl mt-4 mb-2 font-bold">All</h2>
					{showAddTask && (
						<AddTaskForm
							setShowAddTask={setShowAddTask}
							projects={projects}
							labels={labels}
						/>
					)}
					<TodoList todos={todos} />
					{completedTodos.length > 0 && (
						<>
							<h2 className="text-2xl mt-4 mb-2 font-bold flex items-center gap-2">
								Completed
								<span className="text-lg text-muted-foreground">
									({completedTodos.length})
								</span>
							</h2>
							<TodoList todos={completedTodos} />
						</>
					)}
					{incompletedTodos.length > 0 && (
						<>
							<h2 className="text-2xl mt-4 mb-2 font-bold">Incompleted</h2>
							<TodoList todos={incompletedTodos} />
						</>
					)}
				</div>
			</div>
		</main>
	);
}
