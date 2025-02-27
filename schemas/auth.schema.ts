import { z } from "~/lib/zod.config";

export const loginSchema = z.object({
  email: z.string().nonempty("Email không được để trống").email(),
  password: z.string().nonempty("Mật khẩu không được để trống"),
});

export const registerSchema = z
  .object({
    // first_name: z.string().nonempty("Tên không được để trống").min(2).max(50),
    // last_name: z.string().nonempty("Họ không được để trống").min(2).max(50),
    email: z.string().nonempty("Email không được để trống").email(),
    password: z
      .string()
      .nonempty("Mật khẩu không được để trống")
      .min(6)
      .max(255),
    confirmPassword: z.string().nonempty("Vui lòng xác nhận mật khẩu của bạn"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không trùng khớp.",
        path: ["confirmPassword"],
      });
    }
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
