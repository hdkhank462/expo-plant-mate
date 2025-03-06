import { AxiosError } from "axios";
import api from "~/lib/axios.config";
import { AppErrors } from "~/lib/errors";
import { SearchPlantSchema } from "~/schemas/plant.schema";

const searchByKeyword = async (schema: SearchPlantSchema) => {
  console.log("Search Plant by Keyword");

  try {
    const response = await api.request<SearchResponse<Plant>>({
      url: `/plants/search?s=${schema.search}`,
      method: "get",
    });

    return response.data;
  } catch (error) {
    //   if (error instanceof AxiosError) {
    //     if (error.response?.status === 400)
    //       throw AccountErrors.invalidUpdateAccount(error.response.data);
    //   }

    if (error instanceof AppErrors) throw error;
  }
};

const searchByImage = async (formData: FormData) => {
  console.log("Search Plant by Image");

  try {
    const response = await api.request<SearchResponse<Plant>>({
      url: "/plants/search/image/",
      method: "post",
      data: formData,
      configs: {
        timeout: 30000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppErrors) throw error;
  }
};

export { searchByKeyword, searchByImage };
