import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";

export const sendMails = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("user").collect();

    for (const user of users) {
      const { email, prefrence, categoryMap } = user;
      const pref = picRandom(prefrence) as string;

      if (categoryMap[pref].length === 0) {
        // send user mail saying no videos in this category and ask them to update prefrence
        const randomYt_id = categoryMap["random"];

        if (randomYt_id.length === 0) {
          // all videos watched and no videos in random category too so send mail saying no videos left
        } else {
          const yt = await ctx.db.get(randomYt_id.pop() as Id<"yt">);

          if (!yt) continue;
          await ctx.scheduler.runAfter(0, internal.yt.updateYTandUser, {
            userId: user._id,
            id: yt._id,
          });

          await ctx.scheduler.runAfter(0, internal.openAi.transcribe, {
            email: email,
            ytId: yt.id,
            channelTitle: yt.channelTitle,
            thumbnailLink: yt.thumbnailLink,
            title: yt.title,
            userName: user.name,
          });
        }
      } else {
        const videoId = picRandom(categoryMap[pref]);
        const yt = await ctx.db.get(videoId);

        if (!yt) continue;
        await ctx.scheduler.runAfter(0, internal.yt.updateYTandUser, {
          userId: user._id,
          id: yt._id,
        });

        await ctx.scheduler.runAfter(0, internal.openAi.transcribe, {
          email: email,
          ytId: yt.id,
          channelTitle: yt.channelTitle,
          thumbnailLink: yt.thumbnailLink,
          title: yt.title,
          userName: user.name,
        });
      }
    }
  },
});

const picRandom = (arr: any[]): Id<"yt"> => {
  return arr[Math.floor(Math.random() * arr.length)];
};
