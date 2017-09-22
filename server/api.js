const { app, BrowserWindow, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
// const server = require('./server')
const AnyProxy = require('anyproxy');


function sudoExec(cb) {
    const process = require('child_process');   // The power of Node.JS
    var ls = process.spawn('./test.sh');
    app.quit();
    return;

    // shell.openExternal('bash sudo /Users/go886/Desktop/proxy/build/proxy-mas-x64/proxy.app/Contents/MacOS/prox')
    var sudo = require('sudo-prompt');
    var options = {
        name: 'Electron',
        // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
    };
    sudo.exec('/Users/go886/Desktop/proxy/build/proxy-mas-x64/proxy.app/Contents/MacOS/prox', options,
        function (error, stdout, stderr) {
            if (cb) {
                console.log('abc')
            }
        }
    );
}

var rules = {
    *beforeSendRequest(requestDetail) {
        const newRequestOptions = Object.assign({}, requestDetail.requestOptions);
        //   newRequestOptions.headers.Host = "www.baidu.com";
        //newRequestOptions.hostname = "www.baidu.com"
        newRequestOptions.port = 8080;
        // if (newRequestOptions.path == '/pc.html') {
        //     newRequestOptions.path = "/"
        // }
        return {
            requestOptions: newRequestOptions
        };
        if (requestDetail.url.indexOf('http://httpbin.org') === 0) {
            const newRequestOptions = requestDetail.requestOptions;
            newRequestOptions.path = '/user-agent';
            newRequestOptions.method = 'GET';
            return {
                requestOptions: newRequestOptions
            };
        }
    },
};

//获取rule文件
function getRuleModule(id) {
    if (!id) return null;
    const filepath = path.resolve(__dirname, 'rule_custom/' + id + '.js')
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
    start(options, ruleId, cb) {
        options.rule = getRuleModule(ruleId) || rules;
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
                this.server.recorder.getRecords(null, 10000, (err, docs) => {
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
        var rulesPath = path.resolve(__dirname, 'rules.json')
        fs.writeFile(rulesPath, JSON.stringify(rules), 'utf8', (err) => {
            if (err) throw err;
        });
    },
    getRules() {
        var rulesPath = path.resolve(__dirname, 'rules.json')
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
        return __dirname + '/rule_custom';
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
    }
}