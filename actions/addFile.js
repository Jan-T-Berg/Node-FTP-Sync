module.exports = async function (ftpClient, localPath, remotePath) {
  return await new Promise((resolve, reject) => {
    try {
      ftpClient.put(localPath, remotePath, (err) => {
        if (err) {
          console.log(err);
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
