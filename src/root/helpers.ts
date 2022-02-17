export const logError = (e: unknown): void => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    console.error(e);
  }
};
