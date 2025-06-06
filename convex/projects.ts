import { authenticatedQuery } from './lib/withUser';

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
