const { app, dialog, shell, Menu, MenuItem } = require('electron')

function createAppMenu() {
    function openFile(filename) {
        app.$.api.openNewFile(filename);
    }
    function openRecentDocument(menu) {
        openFile(menu.label)
    }
    const template = [
        {
            label: '帮助',
            submenu: [
                {
                    label: '文档',
                    click() {
                        shell.openExternal(
                            `http://site.alibaba.net/rz.li/istyle/guide.html`
                        )
                    }
                }
            ]
        }
    ]


    if (process.env.NODE_ENV === 'development') {
        template.unshift({
            label: 'dev',
            submenu:[
                {role: 'toggledevtools'},                
            ]
        })
    }

    if (process.platform === 'darwin') {
        template.unshift({
            label: 'TCoder',
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })

    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}


module.exports.createAppMenu = createAppMenu;