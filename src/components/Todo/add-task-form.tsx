import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { GET_STARTED_LABEL_ID, GET_STARTED_PROJECT_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
	faBolt,
	faCalendarDays,
	faClock,
	faFolderOpen,
	faHashtag,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
	taskName: z.string().min(2, {
		message: "Task name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	priority: z
		.enum(["low", "medium", "high"])
		.refine((val) => ["low", "medium", "high"].includes(val), {
			message: "Priority must be low, medium, or high.",
		}),
	dueDate: z.date({
		message: "Due date must be a valid date.",
	}),
	dueTime: z.string().optional(),
	projectId: z.string({
		message: "Project ID is required.",
	}),
	labelId: z.string({
		message: "Label ID is required.",
	}),
});

export function AddTaskForm({
	setShowAddTask,
	projects,
	labels,
}: {
	setShowAddTask: Dispatch<SetStateAction<boolean>>;
	projects: Doc<"projects">[];
	labels: Doc<"labels">[];
}) {
	const [showDueTime, setShowDueTime] = useState(false);
	const projectId =
		// myProjectId ||
		// parentTask?.projectId ||
		GET_STARTED_PROJECT_ID as Id<"projects">;

	const labelId =
		// parentTask?.labelId ||
		GET_STARTED_LABEL_ID as Id<"labels">;

	const defaultValues = {
		taskName: "",
		description: "",
		priority: "low",
		dueDate: new Date(),
		dueTime: "", // domyślnie pusty string, zawsze controlled
		projectId,
		labelId,
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues as z.infer<typeof formSchema>,
	});

	const createTodo = useMutation(api.todos.createTodo);

	function onSubmit(data: z.infer<typeof formSchema>) {
		const {
			taskName,
			description,
			priority,
			projectId,
			labelId,
			dueDate,
			dueTime,
		} = data;

		let isDefaultTime = false;

		const finalDueDate = new Date(dueDate);
		if (dueTime && dueTime !== "") {
			const [hours, minutes] = dueTime.split(":").map(Number);
			finalDueDate.setHours(hours || 0, minutes || 0, 0);
		} else {
			isDefaultTime = true;
			finalDueDate.setHours(23, 59, 59);
		}

		createTodo({
			taskName,
			description: description || undefined,
			priority,
			dueDate: finalDueDate.getTime(),
			isDefaultTime,
			projectId: projectId as Id<"projects">,
			labelId: labelId as Id<"labels">,
		})
			.then(() => {
				setShowAddTask(false);
				toast.success("Task created successfully 🎉");
				form.reset(defaultValues as z.infer<typeof formSchema>);
			})
			.catch((error) => {
				toast.error("Failed to create task", { description: error.message });
			});
	}
	return (
		<Card className="flex gap-2 p-4">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col space-y-2"
				>
					{/* Task name */}
					<FormField
						control={form.control}
						name="taskName"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className="!rounded-lg"
										placeholder="Write a task name"
										{...field}
										autoFocus
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Textarea
										placeholder="What is this task about? (optional)"
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<CardContent className="flex p-0 gap-2">
						{/* Due date */}
						<FormField
							control={form.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem className="flex flex-col ">
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"text-left font-normal ",
														!field.value && "text-muted-foreground"
													)}
												>
													<FontAwesomeIcon
														icon={faCalendarDays}
														className="h-4 w-4 text-muted-foreground"
													/>

													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<ChevronDownIcon className="size-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Due time */}
						<FormField
							control={form.control}
							name="dueTime"
							render={({ field }) => (
								<FormItem className="relative flex items-center">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
										<FontAwesomeIcon
											icon={faClock}
											className={`h-4 w-4 ${
												showDueTime
													? "text-muted-foreground"
													: "text-muted-foreground/[.45]"
											}`}
											onClick={() => setShowDueTime(!showDueTime)}
										/>
									</span>
									{showDueTime ? (
										<Input
											type="time"
											id="time-picker"
											step="60"
											className="bg-background pl-9 pr-2 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
											value={field.value ?? ""}
											onChange={field.onChange}
										/>
									) : (
										<Button
											variant={"outline"}
											className={cn(
												"text-left font-normal ",
												!field.value && "text-muted-foreground"
											)}
											onClick={() => setShowDueTime(true)}
										>
											<FontAwesomeIcon
												icon={faPlus}
												className={`pl-6 h-4 w-4`}
											/>
										</Button>
									)}
								</FormItem>
							)}
						/>

						{/* Priority */}
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<FontAwesomeIcon
													icon={faBolt}
													className="h-4 w-4 text-muted-foreground"
												/>
												<SelectValue placeholder="Select a priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">Low</SelectItem>
												<SelectItem value="medium">Medium</SelectItem>
												<SelectItem value="high">High</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Project */}
						<FormField
							control={form.control}
							name="projectId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<FontAwesomeIcon
														icon={faFolderOpen}
														className="h-4 w-4 text-muted-foreground"
													/>
													<SelectValue placeholder="Select a project" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{projects.map((project) => (
													<SelectItem key={project._id} value={project._id}>
														{project.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Label */}
						<FormField
							control={form.control}
							name="labelId"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<FontAwesomeIcon
														icon={faHashtag}
														className="h-4 w-4 text-muted-foreground"
													/>
													<SelectValue placeholder="Select a label" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{labels.map((label) => (
													<SelectItem key={label._id} value={label._id}>
														{label.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>

					<CardFooter className="items-center mt-2 grid grid-cols-2 gap-2 w-full justify-end">
						<Button
							className="w-full"
							variant={"outline"}
							onClick={() => setShowAddTask(false)}
						>
							Cancel
						</Button>
						<Button className="w-full" type="submit">
							Add task
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
