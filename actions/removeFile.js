module.exports = async function (ftpClient, remotePath) {
  return await new Promise((resolve, reject) => {
    try {
      ftpClient.delete(remotePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
