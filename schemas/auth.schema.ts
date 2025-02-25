import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().nonempty("Mật khẩu không được để trống"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
