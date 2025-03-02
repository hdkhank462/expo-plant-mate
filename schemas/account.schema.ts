import { z } from "~/lib/zod.config";

export const emailOnlySchema = z.object({
  email: z.string().nonempty("Email không được để trống").email(),
});

export const changePasswordSchema = z
  .object({
    // oldPassword: z.string().nonempty("Mật khẩu cũ không được để trống"),
    newPassword: z
      .string()
      .nonempty("Mật khẩu mới không được để trống")
      .min(6)
      .max(255),
    confirmNewPassword: z
      .string()
      .nonempty("Vui lòng xác nhận mật khẩu mới của bạn"),
  })
  .superRefine((values, ctx) => {
    checkPassword(values, ctx);
  });

export const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Mật khẩu mới không được để trống")
      .min(6)
      .max(255),
    confirmNewPassword: z
      .string()
      .nonempty("Vui lòng xác nhận mật khẩu mới của bạn"),
  })
  .superRefine((values, ctx) => {
    checkPassword(values, ctx);
  });

export const resetPasswordConfirmSchema = z
  .object({
    uid: z.string().nonempty(),
    token: z.string().nonempty(),
    newPassword: z
      .string()
      .nonempty("Mật khẩu mới không được để trống")
      .min(6)
      .max(255),
    confirmNewPassword: z
      .string()
      .nonempty("Vui lòng xác nhận mật khẩu mới của bạn"),
  })
  .superRefine((values, ctx) => {
    checkPassword(values, ctx);
  });

export const checkPasswordTokenSchema = z.object({
  token: z.string().regex(/^.+?;.+$/, {
    message: "Token không chính xác hoặc đã hết hạn",
  }),
});

const checkPassword = (values: any, ctx: any) => {
  if (values.confirmNewPassword !== values.newPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Mật khẩu không trùng khớp.",
      path: ["confirmNewPassword"],
    });
  }
};

export const updateAccountSchema = z.object({
  // avatarUrl: z.string().url(),
  firstName: z.string().nonempty("Tên không được để trống").min(2).max(50),
  lastName: z.string().nonempty("Họ không được để trống").min(2).max(50),
});

export type EmailOnlySchema = z.infer<typeof emailOnlySchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;
export type ResetSetPasswordConfirmSchema = z.infer<
  typeof resetPasswordConfirmSchema
>;
export type CheckPasswordTokenSchema = z.infer<typeof checkPasswordTokenSchema>;
export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;
