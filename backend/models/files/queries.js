const insertFile = `
  INSERT INTO files (project_id, filename, file_url)
  VALUES ($1, $2, $3)
`;

const getFileByUrl = `
  SELECT * FROM files WHERE file_url = $1
`;

const deleteFileByUrl = `
  DELETE FROM files WHERE file_url = $1
`;

module.exports = {
  insertFile,
  getFileByUrl,
  deleteFileByUrl
};