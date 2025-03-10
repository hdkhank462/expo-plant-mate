type SearchResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type UserPlants = {
  id: number;
  user: number;
  plant: number;
};

type Plant = {
  id: number;
  identifier: string;
  name: string;
  scientific_name: string;
  description: string;
  family: string;
  care_instructions: string;
  image: string;
};
