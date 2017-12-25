const { app, BrowserWindow, ipcMain, shell, dialog} = require('electron');
const fs = require('fs');
const path = require('path');
const AnyProxy = require('anyproxy');
const sudo = require('sudo-prompt');
const pkg = require('../package');


function sudoExec(cb) {
    const ENV_NAME = `${pkg.name}_env`;
    if (process.env[ENV_NAME] != 'root') {
        let options = {
            name: pkg.name,
            icns: path.resolve(__dirname, '../icon.png')
        };

        app.hide();
        sudo.exec(`${ENV_NAME}=root ${process.execPath}`, options, (error, stdout, stderr) => {
            // if (error){
            //     dialog.showMessageBox(null, {
            //         type: 'error',
            //         buttons: ['关闭'],
            //         message: 'Error',
            //         detail: JSON.stringify(error)
            //     });                
            // };
            
            app.quit();            
        });
    } else {
        if (cb) cb();
    }
}

var rules = {
    *beforeSendRequest(requestDetail) {
        const newRequestOptions = Object.assign({}, requestDetail.requestOptions);
        // newRequestOptions.headers.Host = "www.baidu.com";
        // newRequestOptions.hostname = "www.baidu.com"
        newRequestOptions.port = 8080;
        // if (newRequestOptions.path == '/pc.html') {
        //     newRequestOptions.path = "/"
        // }
        return {
            requestOptions: newRequestOptions
        };
    },
};

//获取rule文件
function getRuleModule(id) {
    if (!id) return null;    
    const filepath =  path.join(app.getPath('userData'), 'rule_custom/' + id + '.js')
    if (fs.existsSync(filepath)) {
        var code = fs.readFileSync(filepath, 'utf8');
        code = "return (function(module, exports, require){" + code + "})";
        var module = {
            exports: {}
        };
        var m = (new Function(code))();
        m.call(module, module, module.exports);
        return module.exports;
    } else {
        return null;
    }
}


module.exports = {
    needUpdate: false,
    server: null,
    host() {
        return app.$.server.URL;
    },
    start(options, ruleId, cb) {
        options.rule = getRuleModule(ruleId) || rules;
        if (options.dangerouslyIgnoreUnauthorized == undefined) {
            options.dangerouslyIgnoreUnauthorized = true;
        }
        this.server = new AnyProxy.ProxyServer(options);
        if (this.server && cb) {
            if (cb) {
                this.server.recorder.on('update', (r) => {
                    if (this.needUpdate == false) {
                        this.needUpdate = true;
                        process.nextTick(() => {
                            this.needUpdate = false
                            if (cb) cb();
                        });
                    }
                });
            }
        }

        if (options.port == 80) {
            sudoExec((error) => {
                this.server.start();

            });
        } else {
            this.server.start();
        }
    },
    stop() {
        this.server.close();
        this.server = null;
    },
    getLastRecorders() {
        return new Promise((resolve, reject) => {
            if (this.server.recorder) {
                this.server.recorder.getRecords(null, 1000, (err, docs) => {
                    if (err) {
                        reject(err.toString());
                    } else {
                        resolve(docs);
                    }
                });
            } else {
                reject();
            }
        });
    },
    getRecorder(id) {
        return new Promise((resolve, reject) => {
            if (this.server.recorder) {
                this.server.recorder.getSingleRecord(id, (err, data) => {
                    if (err) {
                        reject(err.toString());
                    } else {
                        resolve(data[0]);
                    }
                })
            } else {
                reject();
            }
        });
    },
    fetchBody(id) {
        return new Promise((resolve, reject) => {
            if (this.server.recorder) {
                this.server.recorder.getDecodedBody(id, (err, result) => {
                    if (err || !result || !result.content) {
                        reject();
                    } else if (result.type && result.type === 'image' && result.mime) {
                        resolve({
                            raw: true,
                            type: result.mime,
                            content: result.content
                        })
                    } else {
                        resolve({
                            id: id,
                            type: result.type,
                            content: result.content
                        })
                    }
                })
            } else {
                reject();
            }
        });
    },
    saveRules(rules) {
        var rulesPath = path.join(app.getPath('userData'), 'rules.json')
        fs.writeFile(rulesPath, JSON.stringify(rules), 'utf8', (err) => {
            if (err) throw err;
        });
    },
    getRules() {
        var rulesPath = path.join(app.getPath('userData'), 'rules.json')
        return new Promise((resolve, reject) => {
            if (fs.existsSync(rulesPath)) {
                var rules = fs.readFileSync(rulesPath, 'utf8');
                resolve(JSON.parse(rules))
            } else {
                resolve([]);
            }
        });
    },
    getRuleValue(id) {
        return new Promise((resolve, reject) => {
            var filename = path.resolve(__dirname, 'rules/' + id + '.js')
            if (!fs.existsSync(filename)) {
                filename = this.getCustomRulePath(id);
                if (!fs.existsSync(filename)) {
                    filename = null;
                }
            }

            if (filename) {
                fs.readFile(filename, (err, data) => {
                    if (err) {
                        reject('');
                    } else {
                        resolve(data.toString());
                    }
                });
            } else {
                reject('文件不存在');
            }
        });
    },
    getCustomRuleDir() {
        return path.join(app.getPath('userData'), '/rule_custom')        
    },
    getCustomRulePath(id) {
        const filename = id + '.js';
        return path.resolve(this.getCustomRuleDir(), filename);
    },
    saveCustomRule(id, rule) {
        const ruleCustomPath = this.getCustomRuleDir();
        if (!fs.existsSync(ruleCustomPath)) {
            fs.mkdir(ruleCustomPath);
        }

        fs.writeFile(this.getCustomRulePath(id), rule, 'utf8', (err) => {
            if (err) throw err;
        });
    },
    deleteCustomRule(id) {
        const rulepath = this.getCustomRulePath(id);
        if (fs.existsSync(rulepath)) {
            fs.unlink(rulepath, (err) => {
                if (err) throw err;
            });
        }
    },
    installCA(url) {
        shell.openExternal(url);
    },
    saveSetting(setting) {
        var filename = path.join(app.getPath('userData'), 'setting.json');
        fs.writeFile(filename, JSON.stringify(setting), 'utf8', (err)=>{
            if (err) throw err;
        });
    },
    getSetting() {
        var filename = path.join(app.getPath('userData'), 'setting.json');
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filename)) {
                var setting = fs.readFileSync(filename, 'utf8');
                setting = JSON.parse(setting);
                resolve(setting)
            } else {
                reject('文件不存在');
            }
        });
    }
}