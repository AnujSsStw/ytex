"use node";

import { v } from "convex/values";
import OpenAI from "openai";
import { internalAction } from "./_generated/server";
// @ts-ignore
import { getSubtitles } from "youtube-captions-scraper";
import { internal } from "./_generated/api";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export const transcribe = internalAction({
  args: {
    ytId: v.string(),
    email: v.string(),
    title: v.string(),
    thumbnailLink: v.string(),
    userName: v.string(),
    channelTitle: v.string(),
  },
  handler: async (ctx, args) => {
    let captions;
    try {
      captions = await getSubtitles({
        videoID: args.ytId, // youtube video id
        lang: "en", // default: `en`
      });
    } catch (error) {
      console.log(error);
      // caption not available
      return;
    }

    const texts = captions
      .map(
        (caption: { start: number; dur: number; text: string }) => caption.text
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
      messages: [
        {
          role: "system",
          content:
            "You will be provided a Paragraph. You need to write a summary and Bullet summary of the following paragraph.",
        },
        {
          // Pass on the chat user's message to GPT
          role: "user",
          content: `By ${args.channelTitle} \n\n ${texts}`,
        },
      ],
    });

    // Pull the message content out of the response
    const messageContent = response.choices[0].message?.content;

    //   send the msgcontent to the /api/mail endpoint
    await fetch(`${process.env.VERCEL_URL}/api/mail`, {
      method: "POST",
      body: JSON.stringify({
        email: args.email,
        summary: messageContent,
        title: args.title,
        videoId: args.ytId,
        name: args.userName,
        bannerLink: args.thumbnailLink,
        channelTitle: args.channelTitle,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});
