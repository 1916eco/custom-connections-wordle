import { TRPCError } from "@trpc/server";
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
        password: z.string(),
        titles: z.object({
          easyTitle: z.string(),
          mediumTitle: z.string(),
          hardTitle: z.string(),
          trickyTitle: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const passwordDb = await ctx.prisma.createWordPassword
        .findUnique({
          where: {
            password: input.password,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res === null) {
            //throw error
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Wrong Password",
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Wrong Password",
          });
        });

      return await ctx.prisma.gameWords.create({
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
    return ctx.prisma.gameWords.findFirst({
      where: {
        hot: true,
      },
      select: {
        id: true,
      },
    });
  }),
});
