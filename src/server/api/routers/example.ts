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
  //create a game input is an object of words and a difficulty number for each word then create the words for that game linking them to the game return the game id
  createGame: publicProcedure
    //input of an array of words and a difficulty number
    .input(
      z.object({
        wordsArray: z.array(
          z.object({
            wordsString: z.string(),
            difficulty: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      const game = ctx.prisma.gameWords.create({
        data: {
          words: {
            // loop over the wordsarray and create a word for each one
            create: input.wordsArray.map((word) => ({
              wordString: word.wordsString,
              difficulty: word.difficulty,
            })),
          },
        },
      });
      return game;
    }),
  getGameById: publicProcedure
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
