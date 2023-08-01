# Node-FTP-Sync

FTP-Überwachung und Datei-Upload-Dokumentation

## Einführung
Dieser Code verwendet Node.js, um einen lokalen Ordner und dessen Unterordner zu überwachen. 
Wenn Änderungen an Dateien im Ordner oder dessen Unterordnern erkannt werden, wird die entsprechende Aktion (Hinzufügen, Ändern oder Entfernen) auf dem FTP-Server ausgeführt, um die Dateien zu synchronisieren.

Solltet ihr es für beide Richtungen verwenden, muss ein "System" in der .env auf false gestellt werden.

```
IS_MAIN_SYSTEM=false

```

## Abhängigkeiten
Bevor du das Skript ausführst, stelle sicher, dass du alle erforderlichen Node.js-Module installiert hast:

- dotenv: Zum Laden von Umgebungsvariablen aus einer .env-Datei.
- fs: Das integrierte Node.js-Modul für Dateisystemzugriffe.
- path: Das integrierte Node.js-Modul zum Verarbeiten von Dateipfaden.
- chokidar: Ein Modul zum Überwachen von Dateiänderungen.
- ftp: Ein FTP-Clientmodul.

Installiere diese Abhängigkeiten mit dem Befehl:

```
npm install 
```
oder
```
npm install dotenv fs path chokidar ftp
```



## Konfiguration
Erstelle eine Datei mit dem Namen .env im selben Verzeichnis wie das Skript, um die Konfigurationsvariablen festzulegen:

### .env
```
FTP_HOST=ftp.example.com
FTP_USER=ftp_user
FTP_PASSWORD=ftp_password
FTP_remoteDir=/remote/folder/
#LOCAL_DIR=/path/to/local/folder/
IS_MAIN_SYSTEM=true
```

Ersetze ftp.example.com, ftp_user, ftp_password, /remote/folder/ und /path/to/local/folder/ durch deine FTP-Serverdetails und den Pfad zum lokalen Ordner, den du überwachen möchtest. 
Die Variable IS_MAIN_SYSTEM dient dazu, festzulegen, ob das Skript als Hauptsystem ausgeführt wird. 
Wenn sie auf true gesetzt ist, wird das Löschen von Dateien vom FTP-Server erlaubt. 
Andernfalls werden Dateien nur von FTP hochgeladen, aber nicht gelöscht.

### config.js
Diese Liste enthält die Dateierweiterungen, die überwacht werden sollen. Du kannst sie entsprechend deiner Anforderungen anpassen.

```
let watchedExtensions = ['.txt', '.png'];
module.exports = watchedExtensions;
```

Ausführung
Führe das Skript aus, indem du den folgenden Befehl in der Konsole ausführst:

```
node index.js
```

oder

```
node .
```

Funktionen und Aktionen
Der Code besteht aus mehreren Aktionen, die bei verschiedenen Änderungen im lokalen Ordner ausgelöst werden:

+ addDir: Diese Aktion wird ausgeführt, wenn ein neues Verzeichnis im lokalen Ordner hinzugefügt wird. Das Verzeichnis wird rekursiv auf dem FTP-Server erstellt.

+ add: Diese Aktion wird ausgeführt, wenn eine neue Datei im lokalen Ordner oder in einem seiner Unterordner hinzugefügt wird und die Dateierweiterung in der Liste der überwachten Erweiterungen enthalten ist. Die Datei wird auf den FTP-Server hochgeladen.

+ change: Diese Aktion wird ausgeführt, wenn eine Datei im lokalen Ordner oder in einem seiner Unterordner geändert wird und die Dateierweiterung in der Liste der überwachten Erweiterungen enthalten ist. Die Datei wird von FTP gelöscht und dann erneut hochgeladen, um die Änderungen zu aktualisieren.

+ unlinkDir: Diese Aktion wird ausgeführt, wenn ein Verzeichnis im lokalen Ordner entfernt wird. Das entsprechende Verzeichnis wird auch auf dem FTP-Server gelöscht, sofern IS_MAIN_SYSTEM auf true gesetzt ist.

+ unlink: Diese Aktion wird ausgeführt, wenn eine Datei im lokalen Ordner entfernt wird und die Dateierweiterung in der Liste der überwachten Erweiterungen enthalten ist. Die Datei wird auch von FTP gelöscht, sofern IS_MAIN_SYSTEM auf true gesetzt ist.

## Abschluss
Mit diesem Code kannst du einen Ordner und dessen Unterordner überwachen und die Dateien bei Änderungen automatisch auf den FTP-Server hochladen. 
Dabei kannst du die Konfiguration und die Liste der überwachten Erweiterungen in der .env-Datei und der config.js-Datei anpassen.
