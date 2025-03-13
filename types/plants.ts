type SearchResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type Plant = {
  id: number;
  identifier: string;
  name: string;
  scientific_name: string;
  family: string;
  image: string;
};

type PlantDetail = Plant & {
  description: string;
  care_instructions: string;
};

type UserPlants = {
  id: number;
  user: number;
  plant: number;
};

type UserPlantsDetail = UserPlants & {
  plant_detail: Plant;
};

type CareType = "water" | "fertilize" | "repot" | "prune" | "clean";
type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

type UserPlantCare = {
  id: number;
  user_plant: number;
  user_plant_detail: UserPlantsDetail;
  type: CareType;
  time: string;
  repeat: WeekDay[];
};

type UserPlantCareLocal = UserPlantCare & {
  enabled?: boolean;
};
