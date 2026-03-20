import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const PI_APP_SECRET = process.env.PI_APP_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session } = req.body;
    
    if (!session || !session.data || !session.metadata) {
      return res.status(400).json({ error: "Invalid session data" });
    }

    // Verify HMAC signature from Pi Network
    const hmac = crypto
      .createHmac("sha256", PI_APP_SECRET)
      .update(session.data)
      .digest("hex");

    if (hmac !== session.metadata.hmac) {
      return res.status(401).json({ error: "Invalid Pi session signature" });
    }

    const userData = JSON.parse(session.data);
    
    return res.status(200).json({
      status: "authenticated",
      pi_uid: userData.uid,
      username: userData.username
    });

  } catch (err) {
    console.error("Pi identity verification error:", err);
    return res.status(500).json({ error: "Identity verification failed" });
  }
}
