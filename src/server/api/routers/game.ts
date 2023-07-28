import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
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
        titles: z.object({
          easyTitle: z.string(),
          mediumTitle: z.string(),
          hardTitle: z.string(),
          trickyTitle: z.string(),
        }),
      })
    )
    .mutation(({ ctx, input }) => {
      // Create the Titles first

      // Then, create the GameWords and associate them with the Titles
      return ctx.prisma.gameWords.create({
        data: {
          easyTitle: input.titles.easyTitle,
          mediumTitle: input.titles.mediumTitle,
          hardTitle: input.titles.hardTitle,
          trickyTitle: input.titles.trickyTitle,
          words: {
            create: input.wordsArray.map((word) => {
              return {
                wordString: word.wordsString,
                difficulty: word.difficulty,
              };
            }),
          },
        },
      });
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
  getRandomGame: publicProcedure.input(z.object({})).query(({ ctx, input }) => {
    //get a random game from the database most recently created and return only the id
    return ctx.prisma.gameWords.findFirst({
      // get the one that is "hot"
      where: {
        hot: true,
      },
      select: {
        id: true,
      },
    });
  }),
});
