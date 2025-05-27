import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const newTodoId = await ctx.db.insert('todos', {
      text: args.text,
      status: 'todo',
    });
    return newTodoId;
  },
});

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('todos').collect();
  },
});
