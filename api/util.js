import crypto from "crypto";

export const hash = (val) => crypto.createHash("md5").update(val).digest("hex");
