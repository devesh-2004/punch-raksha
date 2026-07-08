import { z } from "zod";
import { requireAuth } from "@/lib/utils/customerAuth";
import { signAuthToken, setAuthCookie } from "@/lib/auth";
import * as usersRepo from "@/lib/repositories/user.repository";
import { jsonBad, jsonOk, jsonZodError } from "@/lib/utils/api";
import { rateLimit } from "@/lib/rate-limit";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

export async function PATCH(req: Request) {
  const limited = rateLimit(req, { key: "user-phone-patch", limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const auth = requireAuth();
    if (!auth) return jsonBad("Unauthorized", 401);

    const { idToken } = z.object({ idToken: z.string().min(1) }).parse(await req.json());

    const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const phoneNumber = decoded.phone_number;
    const phone = phoneNumber?.replace(/^\+91/, "");
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return jsonBad("Invalid phone number", 400);
    }

    const existing = await usersRepo.findByPhone(phone, auth.userId);
    if (existing) return jsonBad("Phone number already in use by another account", 400);

    const user = await usersRepo.updateById(auth.userId, { phone }, { safe: true });
    if (!user) return jsonBad("User not found", 404);

    const token = signAuthToken({ userId: String(user._id), phone: user.phone });
    setAuthCookie(token);
    return jsonOk({ user });
  } catch (err) {
    const zod = jsonZodError(err);
    if (zod) return zod;
    console.error("Phone update verify error:", err);
    return jsonBad("Invalid or expired session, please try again", 401);
  }
}
