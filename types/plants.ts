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
