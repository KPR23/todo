import { v } from 'convex/values';
import { authenticatedMutation, authenticatedQuery } from './lib/withUser';

export const getTodos = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('todos')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .collect();
  },
});

export const getCompletedTodos = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('todos')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .filter((q) => q.eq(q.field('isCompleted'), true))
      .collect();
  },
});

export const getIncompletedTodos = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('todos')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .filter((q) => q.eq(q.field('isCompleted'), false))
      .collect();
  },
});

export const createTodo = authenticatedMutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    dueDate: v.number(),
    projectId: v.id('projects'),
    labelId: v.id('labels'),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('todos', {
      user: ctx.user._id,
      taskName: args.taskName,
      description: args.description,
      priority: args.priority,
      dueDate: args.dueDate,
      projectId: args.projectId,
      labelId: args.labelId,
      embedding: args.embedding,
      isCompleted: false,
    });
  },
});

export const checkTodo = authenticatedMutation({
  args: {
    todoId: v.id('todos'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.todoId, { isCompleted: true });
  },
});

export const uncheckTodo = authenticatedMutation({
  args: {
    todoId: v.id('todos'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.todoId, { isCompleted: false });
  },
});
