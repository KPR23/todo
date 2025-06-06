import { v } from 'convex/values';
import { authenticatedMutation, authenticatedQuery } from './lib/withUser';

export const getLabels = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    const userLabels = await ctx.db
      .query('labels')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .collect();

    const systemLabels = await ctx.db
      .query('labels')
      .filter((q) => q.eq(q.field('type'), 'system'))
      .collect();

    return [...systemLabels, ...userLabels];
  },
});

export const createLabel = authenticatedMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('labels', {
      name: args.name,
      type: 'user',
      user: ctx.user._id,
    });
  },
});
