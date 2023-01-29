export default function getMenuTemplate(window) {
    const template = [
        {
            label: 'DevTools',
            click: async () => {
                window.webContents.openDevTools();
            }
        }
    ];
    return template;
}