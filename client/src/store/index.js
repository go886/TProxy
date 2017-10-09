import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'


Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        records: [],
        rules: [],
        activeRule: null,
        setting: {
            port: 8089,
            recordlist: false,
            global: false,
            forceProxyHttps: false,
            silent: false,
            webInterface: {
                enable: false,
                webPort: 8002,
                wsPort: 8003,
            },
        },

        isrunning: false,
    },
    mutations: {
    },
    getters: {
        networkData: state => {
            return state.records;
        },
        setting: state => {
            return state.setting;
        },
        rules: state => {
            return state.rules;
        }
    }
})

const methods = {
    start() {
        var state = this.state;
        if (state.isrunning) {
            this.stop();
        }
        state.isrunning = true;
        const curlRule = state.activeRule||{}
        this.$.api.start(state.setting, curlRule.id, (res) => {
            this.$.api.getLastRecorders().then(res => {
                this.setRecords(res)
            }).catch(err => {
                alert(err);
            });
        });
    },
    restart() {
        if (this.state.isrunning) {
            this.stop();
            this.start();
        }
    },
    stop() {
        this.$.api.stop();
        this.state.isrunning = false;
    },
    setRecords(newrecorders) {
        this.state.records = newrecorders.reverse();
    },
    isrunning(status) {
        this.state.isrunning = status;
    },
    setRules(rules) {
        this.state.rules = rules || [];
    },
    addRule(rule) {
        this.state.rules.push(rule);
        this.saveRules();
    },
    removeRule(ruleId) {
        var rules = this.state.rules.filter((item) => {
            if (item.id === ruleId) {
                this.$.api.deleteCustomRule(ruleId)
                return false;
            }
            return true;
        });

        this.setRules(rules);
        this.saveRules();
        var curRule = this.state.activeRule;
        if (curRule && curRule.id === ruleId) {
            this.applyRule(null);
        }
    },
    applyRule(rule) {
        if (this.state.activeRule != rule) {
            this.state.activeRule = rule;
            this.restart();
        }
    },
    saveRules() {
        this.$.api.saveRules(this.state.rules);
    },
    saveRuleContent(ruleId, ruleValue) {
        this.$.api.saveCustomRule(ruleId, ruleValue);
        const curRule = this.state.activeRule;
        if (curRule && curRule.id == ruleId) {
            this.restart();
        }
    }
}


Object.keys(methods).forEach((key) => {
    store[key] = methods[key];
});

console.log(store);

export default store;
