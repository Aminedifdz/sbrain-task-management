export const getCursor = (
  cursorId?: number | null,
) => {
  return cursorId ? { id: cursorId } : undefined;
};

export const getSkip = (cursor?: any | null) => {
  return cursor ? 1 : undefined;
};
