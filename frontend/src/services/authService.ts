import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["STUDENT", "TUTOR"]).optional(),
  phone:z.string().min(10).max(15).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AuthService = {
  async register(data: z.infer<typeof RegisterSchema>) {
    // 1. Validate input
    const validated = RegisterSchema.parse(data);

    // 2. Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      throw new Error("User already exists");
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
        role: validated.role || "STUDENT",
      },
    });

    // 5. Create specific profile if needed
    if (user.role === "TUTOR") {
      await prisma.tutorProfile.create({
        data: {
          userId: user.id,
          hourlyRate: 20, // Default
        },
      });
    }

    // 6. Generate Token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  },

  async login(data: z.infer<typeof LoginSchema>) {
    const validated = LoginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(validated.password, user.password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  },
};
