export const getStaticPath = (path: string) => {
  return process.env.NODE_ENV === 'production' 
    ? `/planner${path}`
    : path;
};
