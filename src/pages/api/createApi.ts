import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
export type Data = {
  res: string | null;
  error: string | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { userId } = req.body;

    const token = jwt.sign({ userId }, "sheeeeee", {
      expiresIn: "100d",
    });

    res.status(200).json({ res: token, error: null });
  }
  res.status(400).json({ error: "Invalid request", res: null });
}
