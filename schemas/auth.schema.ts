import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Tên người dùng phải có ít nhất 3 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

