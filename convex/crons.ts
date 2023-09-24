import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Sending daily email",
  { hourUTC: 16, minuteUTC: 0 }, // Every day at 8:00am PST
  internal.mail.sendMails
);

export default crons;
