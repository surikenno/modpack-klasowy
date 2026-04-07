const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- KONFIGURACJA ---
const CONFIG = {
    username: "surikenno",
    repo: "mc-server-files",
    branch: "main",
    minecraftVersion: "1.20.1",
    modLoader: "forge",
    loaderVersion: "47.2.0",
    javaVersion: "17"
};

const modsFolder = './mods'; // Folder z plikami .jar
const outputFile = 'manifest.json';

// Funkcja do obliczania sumy kontrolnej SHA1
function getHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha1').update(fileBuffer).digest('hex');
}

async function generate() {
    console.log("Rozpoczynam generowanie manifestu...");

    const manifest = {
        version: "1.0.0",
        launcherConfig: {
            minecraftVersion: CONFIG.minecraftVersion,
            modLoader: CONFIG.modLoader,
            loaderVersion: CONFIG.loaderVersion,
            javaVersion: CONFIG.javaVersion
        },
        files: []
    };

    if (!fs.existsSync(modsFolder)) {
        console.error(`BŁĄD: Folder ${modsFolder} nie istnieje!`);
        return;
    }

    const files = fs.readdirSync(modsFolder);

    files.forEach(file => {
        if (file.endsWith('.jar')) {
            const filePath = path.join(modsFolder, file);
            const hash = getHash(filePath);
            
            // Tworzenie bezpośredniego linku do GitHub RAW
            const url = `https://raw.githubusercontent.com/${CONFIG.username}/${CONFIG.repo}/${CONFIG.branch}/mods/${encodeURIComponent(file)}`;

            manifest.files.push({
                path: `mods/${file}`,
                hash: hash,
                url: url
            });
            
            console.log(`Dodano: ${file}`);
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
    console.log("---------------------------------------");
    console.log(`Sukces! Plik ${outputFile} został wygenerowany.`);
    console.log(`Liczba modów: ${manifest.files.length}`);
}

generate();