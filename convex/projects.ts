import { v } from 'convex/values';
import { authenticatedMutation, authenticatedQuery } from './lib/withUser';

export const getProjects = authenticatedQuery({
  args: {},
  handler: async (ctx) => {
    const userProjects = await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('user'), ctx.user._id))
      .collect();

    const systemProjects = await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('type'), 'system'))
      .collect();

    return [...systemProjects, ...userProjects];
  },
});

export const getProjectByProjectId = authenticatedQuery({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const createProject = authenticatedMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('projects', {
      name: args.name,
      type: 'user',
      user: ctx.user._id,
    });
  },
});
