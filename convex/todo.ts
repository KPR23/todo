import { v } from 'convex/values';
import { mutation } from './_generated/server';

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
