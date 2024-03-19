export type TaskStatus =
  | 'Incomplete'
  | 'Complete';

export type ObjectStringMessageType = {
  message: string;
};

export type GenericObjectMessageType<T> = {
  [P in keyof T]: T[P];
};
