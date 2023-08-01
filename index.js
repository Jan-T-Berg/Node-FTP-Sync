require("dotenv").config();
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const FTP = require("ftp");
const watchedExtensions = require("./config");
let ftpConnected = false;

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  remoteDir: process.env.FTP_remoteDir, // Der Pfad auf dem FTP-Server, in den die Dateien geschoben werden sollen
};

let ftpClient = new FTP();

// Der lokale Ordner, der überwacht werden soll
const localDir = process.env.LOCAL_DIR || path.join(__dirname, "local");

ftpClient.on("ready", () => {
  ftpConnected = true;

  // Überwache den lokalen Ordner auf Änderungen von Dateien mit den angegebenen Erweiterungen
  chokidar
    .watch(localDir, {
      persistent: true,
      ignored: /(^|[\/\\])\../,
      depth: Infinity,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    })
    .on("all", async (event, localPath) => {
      const remotePath = localPath.substr(path.resolve(localDir).length + 1);

      switch (event) {
        case "addDir":
          await require("./actions/addDir")(ftpClient, remotePath);
          break;
        case "add":
          if (!watchedExtensions.includes(path.extname(localPath))) return; // Datei hat eine nicht überwachte Erweiterung

          let file_exist = await require("./actions/checkFile")(
            ftpClient,
            remotePath
          );

          //Dont Delete me!
          //Beim Change wird die Datei gelöscht und neu hochgeladen
          //deswegen darf bei Add nicht nochmal hochgeladen werden, da wir sonst ein Infinity Loop haben
          if (file_exist) {
            return;
          }

          await require("./actions/addFile")(ftpClient, localPath, remotePath);
          break;

        case "change":
          if (!watchedExtensions.includes(path.extname(localPath))) return; // Datei hat eine nicht überwachte Erweiterung

          let exist = await require("./actions/checkFile")(
            ftpClient,
            remotePath
          );

          if (exist) {
            await require("./actions/removeFile")(ftpClient, remotePath);
          }

          await require("./actions/addFile")(ftpClient, localPath, remotePath);
          break;

        case "unlinkDir":
          if (process.env.IS_MAIN_SYSTEM != "true") {
            return;
          }

          await require("./actions/removeDir")(ftpClient, remotePath);

          break;

        case "unlink":
          if (!watchedExtensions.includes(path.extname(localPath))) return; // Datei hat eine nicht überwachte Erweiterung

          if (process.env.IS_MAIN_SYSTEM != "true") {
            return;
          }
          await require("./actions/removeFile")(ftpClient, remotePath);
          break;
      }
    });
});

ftpClient.on("error", (err) => {
  try {
    ftpClient.end();
    chokidar.close();
  } catch (err) {
    ftpClient.connect(ftpConfig);
  }
});

ftpClient.on("disconnect", () => {
  try {
    ftpClient.end();
    chokidar.close();
  } catch (err) {
    ftpClient.connect(ftpConfig);
  }
});

ftpClient.connect(ftpConfig);
