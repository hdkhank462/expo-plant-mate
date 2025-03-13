import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import api from "~/lib/axios.config";
import { AppErrors, BaseSchemaError } from "~/lib/errors";
import { PlantCareSchema, SearchPlantSchema } from "~/schemas/plant.schema";

export class PlantErrors<T> extends BaseSchemaError<T> {
  name = "PlantErrors";

  static readonly PlantAlreadyInCollection: ErrorObject = {
    code: "PLANT_ALREADY_IN_COLLECTION",
    message: "Cây này đã có trong bộ sưu tập của bạn",
  };

  static plantAlreadyInCollection() {
    return new this(this.PlantAlreadyInCollection, {
      nonFieldErrors: this.PlantAlreadyInCollection.message,
    });
  }
}

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

const getPlantById = async (id: string) => {
  console.log("Get Plant by ID");

  try {
    const response = await api.request<PlantDetail>({
      url: `/plants/${id}`,
      method: "get",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppErrors) throw error;
  }
};

const addPlantToCollection = async (user: number, plant: number) => {
  console.log("Add Plant to Collection");

  try {
    const response = await api.request<UserPlantsDetail>({
      url: "/plants/user/plants/",
      method: "post",
      data: { user, plant },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        if (
          error.response.data?.non_field_errors &&
          "unique" in error.response.data.non_field_errors
        )
          throw PlantErrors.plantAlreadyInCollection();
      }
    }

    if (error instanceof AppErrors) throw error;
  }
};

const getUserPlants = async () => {
  console.log("Get User Plants");

  try {
    const response = await api.request<UserPlantsDetail[]>({
      url: "/plants/user/plants/",
      method: "get",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppErrors) throw error;
  }
};

const deleteUserPlant = async (id: number) => {
  console.log("Delete User Plant");

  try {
    await api.request({
      url: `/plants/user/plants/${id}/`,
      method: "delete",
    });

    return true;
  } catch (error) {
    return false;
  }
};

const getUserPlantCares = async () => {
  console.log("Get User Plant Cares");

  try {
    const response = await api.request<UserPlantCare[]>({
      url: "/plants/user/plant-cares",
      method: "get",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppErrors) throw error;
  }
};

const createPlantCare = async (schema: PlantCareSchema) => {
  console.log("Create Plant Care");

  try {
    const response = await api.request<UserPlantCare>({
      url: "/plants/user/plant-cares/",
      method: "post",
      data: {
        user_plant: parseInt(schema.userPlantId.value),
        type: schema.type.value,
        time: `${schema.time.getHours()}:${schema.time.getMinutes()}`,
        repeat: schema.repeat,
      },
    });

    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Tạo lịch chăm sóc cây thành công",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppErrors) throw error;
  }
};

export {
  searchByKeyword,
  searchByImage,
  getPlantById,
  addPlantToCollection,
  getUserPlants,
  deleteUserPlant,
  getUserPlantCares,
  createPlantCare,
};
