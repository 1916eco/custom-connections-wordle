import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  getGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.gameWords.findUnique({
        where: {
          id: input.id,
        },
        include: {
          words: true,
        },
      });
    }),
});
