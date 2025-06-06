import { v } from 'convex/values';
import { authenticatedMutation, authenticatedQuery } from './lib/withUser';

export const getSubTodos = authenticatedQuery({
  args: {
    todoId: v.id('todos'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('subTodos')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .filter((q) => q.eq(q.field('parentId'), args.todoId))
      .collect();
  },
});

export const createSubTodo = authenticatedMutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    dueDate: v.number(),
    projectId: v.id('projects'),
    labelId: v.id('labels'),
    parentId: v.id('todos'),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('subTodos', {
      parentId: args.parentId,
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

export const checkSubTodo = authenticatedMutation({
  args: {
    todoId: v.id('subTodos'),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo || todo.user !== ctx.user._id) {
      throw new Error('[Convex] Todo not found or unauthorized');
    }
    await ctx.db.patch(args.todoId, { isCompleted: true });
  },
});

export const uncheckSubTodo = authenticatedMutation({
  args: {
    todoId: v.id('subTodos'),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo || todo.user !== ctx.user._id) {
      throw new Error('[Convex] Todo not found or unauthorized');
    }
    await ctx.db.patch(args.todoId, { isCompleted: false });
  },
});
