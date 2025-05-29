import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { handleUserId } from './auth';

// Queries
export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error('Unauthenticated call to query');
    }

    return await ctx.db.query('todos').collect();
  },
});

// Mutations
export const createTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id('projects'),
    labelId: v.id('labels'),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await handleUserId(ctx);

      if (userId) {
        const newTaskId = await ctx.db.insert('todos', {
          userId,
          taskName: args.taskName,
          description: args.description,
          priority: args.priority,
          dueDate: args.dueDate,
          projectId: args.projectId,
          labelId: args.labelId,
          isCompleted: false,
          embedding: args.embedding,
        });

        return newTaskId;
      }

      return null;
    } catch (err) {
      console.log('[Convex] Error occurred during createTodo mutation', err);

      return null;
    }
  },
});
