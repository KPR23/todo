import {
  customCtx,
  customMutation,
  customQuery,
} from 'convex-helpers/server/customFunctions';
import {
  mutation as baseMutation,
  query as baseQuery,
} from '../_generated/server';

export const WithUserCtx = customCtx(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error('[Convex] Unauthenticated call');
  }

  const user = await ctx.db
    .query('users')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .withIndex('by_token', (q: any) =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error('[Convex] Unauthenticated call');
  }

  return { identity, user };
});

export const authenticatedQuery = customQuery(baseQuery, WithUserCtx);
export const authenticatedMutation = customMutation(baseMutation, WithUserCtx);
