module.exports = async function (ftpClient, remotePath) {
  return await new Promise((resolve, reject) => {
    try {
      ftpClient.rmdir(remotePath, true, (err) => {
        if (err) {
          reject(err);
          console.log(err);
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
