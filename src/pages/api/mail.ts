// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import YtTemplate from "../../../react-email-starter/emails/YtMail";
import { render } from "@react-email/render";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, summary, tilte, videoId, name, bannerLink, channelTitle } =
    req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "aniproductmail@gmail.com",
      pass: process.env.PASSWORD,
    },
  });

  const emailHtml = render(
    YtTemplate({
      bannerLink: bannerLink,
      summary: summary,
      title: tilte,
      firstName: name,
      ytLink: `https://www.youtube.com/watch?v=${videoId}`,
      channelTitle: channelTitle,
    })
  );

  const options = {
    from: "aniproductmail@gmail.com",
    to: email,
    subject: "Fresh 🪟",
    html: emailHtml,
  };

  const a = await transporter.sendMail(options);
  a.accepted.forEach((element) => {
    console.log(element);
  });
  a.rejected.forEach((element) => {
    console.log(element);
  });

  res.status(200).json({ name: "success" });
}
