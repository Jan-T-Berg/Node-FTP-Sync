module.exports = async function (ftpClient, remotePath) {
  let bytes = 0;

  bytes =
    (await new Promise((resolve, reject) => {
      try {
        ftpClient.size(remotePath, (err, size) => {
          if (err) {
            resolve(0);
          } else {
            resolve(size);
          }
        });
      } catch (err) {
        resolve(0);
      }
    })) || 0;

  if (bytes > 0) {
    return true;
  } else {
    return false;
  }
};
