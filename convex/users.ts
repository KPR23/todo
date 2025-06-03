import { mutation, query } from './_generated/server';

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        '[Convex Users] Called storeUser without authentication present'
      );
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier)
      )
      .unique();

    const derivedName =
      identity.name || identity.email?.split('@')[0] || 'Anonymous User';

    if (user !== null) {
      if (user.name !== derivedName) {
        await ctx.db.patch(user._id, { name: derivedName });
      }
      return user._id;
    }

    return await ctx.db.insert('users', {
      name: derivedName,
      email: identity.email!,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(
        '[Convex Users] Called getCurrentUser without authentication present'
      );
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) =>
        q.eq('tokenIdentifier', identity.tokenIdentifier)
      )
      .unique();

    return user;
  },
});
