module.exports = async function (ftpClient, remotePath) {
  return await new Promise((resolve, reject) => {
    try {
      ftpClient.mkdir(remotePath, true, (err) => {
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
