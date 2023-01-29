import { homedir } from 'os'
import { readFileSync, writeFileSync, existsSync, readFile, writeFile } from 'fs';
import { join } from 'path';

const DEFAULT_API_URL = 'http://54.178.81.72:8443';
const configFile = join(homedir(), '.pceduhelper.json')
const DEFAULT_CONFIG = {
    apiUrl: DEFAULT_API_URL,
    subjects: [
        "Математика",
        "КСЕ",
        "ОСС",
        "Комп. графика",
        "Русский язык",
        "Кырг. язык",
        "Кырг.язык и лит-ра",
    ],
    teachers: [
        "Усупова Г.У.",
        "Эсентурова А.Ж.",
        "Абдрахманова Д.Д.",
        "Иманалиев Т.И.",
        "Молдошова Г.М.",
        "Бубнева В.Б.",
        "Искендерова С.И."
    ]
}

export function configure(window) {
    if (!existsSync(configFile))
        writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, null, 2));
    const configAsJson = JSON.parse(readFileSync(configFile));
    console.log(process.env['API_URL']);
    process.env['API_URL'] = configAsJson.apiUrl;
    console.log(process.env['API_URL']);
    console.log(configAsJson.apiUrl);

    window.webContents.once('dom-ready', () => {
        window.webContents.send('datalist',
            { teachers: configAsJson.teachers, subjects: configAsJson.subjects }
        )
    })
}

export function configureDatalist(datalistObject) {
    readFile(configFile, 'utf8', (err, data) => {
        const configAsJson = JSON.parse(data);
        configAsJson.subjects = datalistObject.subjects;
        configAsJson.teachers = datalistObject.teachers;
        writeFile(configFile, JSON.stringify(configAsJson, null, 2), 'utf8', (err) => {
            console.log(err);
        });
    });
}