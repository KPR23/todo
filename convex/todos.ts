import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./lib/withUser";

export const getTodos = authenticatedQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("todos")
			.filter((q) => q.eq(q.field("user"), ctx.user._id))
			.collect();
	},
});

export const createTodo = authenticatedMutation({
	args: {
		taskName: v.string(),
		description: v.optional(v.string()),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		dueDate: v.number(),
		dueTime: v.optional(v.string()),
		projectId: v.id("projects"),
		labelId: v.id("labels"),
		embedding: v.optional(v.array(v.float64())),
	},
	handler: async (ctx, args) => {
		let dueDateTime = args.dueDate;
		if (args.dueTime) {
			const [hours, minutes] = args.dueTime.split(":").map(Number);
			const dueDateObj = new Date(args.dueDate);
			dueDateObj.setHours(hours, minutes, 0, 0);
			dueDateTime = dueDateObj.getTime();
		}

		await ctx.db.insert("todos", {
			user: ctx.user._id,
			taskName: args.taskName,
			description: args.description,
			priority: args.priority,
			dueDate: args.dueDate,
			dueTime: dueDateTime,
			projectId: args.projectId,
			labelId: args.labelId,
			embedding: args.embedding,
			isCompleted: false,
		});
	},
});

export const deleteTodo = authenticatedMutation({
	args: {
		todoId: v.id("todos"),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo || todo.user !== ctx.user._id) {
			throw new Error("[Convex] Todo not found or unauthorized");
		}
		await ctx.db.delete(args.todoId);
	},
});

export const checkTodo = authenticatedMutation({
	args: {
		todoId: v.id("todos"),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo || todo.user !== ctx.user._id) {
			throw new Error("[Convex] Todo not found or unauthorized");
		}
		await ctx.db.patch(args.todoId, { isCompleted: true });
	},
});

export const uncheckTodo = authenticatedMutation({
	args: {
		todoId: v.id("todos"),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo || todo.user !== ctx.user._id) {
			throw new Error("[Convex] Todo not found or unauthorized");
		}
		await ctx.db.patch(args.todoId, { isCompleted: false });
	},
});
