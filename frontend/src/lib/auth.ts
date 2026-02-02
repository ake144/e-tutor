import { jwtVerify, SignJWT } from "jose";

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      return new TextEncoder().encode("dev_secret_key_change_me");
    }
    throw new Error("JWT_SECRET_KEY is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token expires in 24 hours
      .sign(getJwtSecretKey());
  }