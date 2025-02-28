import { z } from "~/lib/zod.config";

export const searchPlantSchema = z.object({
  search: z.string().nonempty("Vui lòng nhập tên cây cần tìm"),
});

export type SearchPlantSchema = z.infer<typeof searchPlantSchema>;
