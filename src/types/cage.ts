export type cage = {
  _id?: string;
  cageNumber: number;
  animals: Array<animal>;
};

export type animal = {
  type: string;
  eat: number;
};
