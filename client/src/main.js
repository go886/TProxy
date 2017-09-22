// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

// import VueQriously from 'vue-qriously'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// Vue.use(VueQriously);
Vue.use(ElementUI);
Vue.use({
  install(Vue, options) {
    if (window.require) {
      var __re_q = window.require
      const electron = __re_q('electron');
      const app = electron.remote.app;
      Vue.prototype.$ = {
        api: app.$.api,
        remote: electron.remote,
        setting: app.$.setting,
        ipc: electron.ipcRenderer
      }

      store.$ = Vue.prototype.$;
    }
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
