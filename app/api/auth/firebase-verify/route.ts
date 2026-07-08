import { z } from "zod";
import * as usersRepo from "@/lib/repositories/user.repository";
import { jsonBad, jsonOk, jsonZodError } from "@/lib/utils/api";
import { setAuthCookie, signAuthToken } from "@/lib/auth";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ idToken: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const limited = rateLimit(req, { key: "firebase-verify", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const { idToken } = schema.parse(await req.json());

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const phoneNumber = decoded.phone_number; // E.164, e.g. +919876543210
    const phone = phoneNumber?.replace(/^\+91/, "");

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return jsonBad("Invalid phone number", 400);
    }

    const user = await usersRepo.upsertByPhone(phone);

    const token = signAuthToken({ userId: String(user._id), phone: user.phone });
    setAuthCookie(token);

    return jsonOk({ ok: true });
  } catch (err) {
    const zod = jsonZodError(err);
    if (zod) return zod;
    console.error("Firebase verify error:", err);
    return jsonBad("Invalid or expired session, please try again", 401);
  }
}
