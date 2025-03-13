import { z } from "~/lib/zod.config";

export const searchPlantSchema = z.object({
  search: z.string().nonempty("Vui lòng nhập tên cây cần tìm"),
});

const zodSelectValue = { value: z.string(), label: z.string() };

export const plantCareSchema = z.object({
  userPlantId: z.object(zodSelectValue, {
    invalid_type_error: "Vui lòng chọn cây",
    message: "Vui lòng chọn cây",
  }),
  type: z.object(zodSelectValue, {
    invalid_type_error: "Vui lòng chọn loại chăm sóc",
    message: "Vui lòng chọn loại chăm sóc",
  }),
  time: z.date(),
  repeat: z.array(z.string()).nonempty("Vui lòng chọn ngày lặp lại"),
});

export type SearchPlantSchema = z.infer<typeof searchPlantSchema>;
export type PlantCareSchema = z.infer<typeof plantCareSchema>;
