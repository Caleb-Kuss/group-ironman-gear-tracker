export type SingleClueType = {
  _id: number;
  clueId?: any;
  name: string;
  type: string;
  largePhoto?: string;
  spritePhoto: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalItems?: number;
  selectedColor?: string;
  username?: string;
};

export type QueryType = {
  type: string;
};

export type incrementAndDecrementTotalItems = {
  setTotal: (value: number | ((prevTotal: number) => number)) => void;
  total: number;
};

export type ID = {
  _id: number;
};

export type UserClues = {
  userId: string;
  clueId: string;
  clueCount: number;
  totalItems: number;
};
