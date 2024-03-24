export const extractTableNames = (files) => {
  return files.map((file) => {
    const fileNameWithoutExtension = file.slice(0, -5); // Remove the last 5 characters which is the '.json' extension
    return fileNameWithoutExtension.split('_').slice(1).join('_');
  });
};
