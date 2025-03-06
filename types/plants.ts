type SearchResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type Plant = {
  identifier: string;
  name: string;
  scientific_name: string;
  description: string;
  family: string;
  care_instructions: string;
  image: string;
};
