<template>
  <div class='root'>
    <MainBar />

    <div class="content">
      <Left />
      <div class="right">
        <div class="rightcontent">
          <router-view></router-view>
        </div>
        <ToastBar />
      </div>
    </div>

    <!-- <div class='content' id='drop' @dragover='ondragover' @dragleave='ondragleave' @drop='ondrop'>
                        <div class='qr' id='qr' :style="{visibility:isrunning ? 'visible': 'hidden'}">
                            <div id='qrcode' style="background:white;" @click="onqrcode">
                                <qriously :value="qrcode" :size="245" />
                            </div>
                        </div>
                        <div class='dropproject' id='dropproject' ref='dropproject'>
                            <span class="droptip" id='projectname'>{{projectName}}</span>
                        </div>
                    </div> -->

  </div>
</template>

<script>
import MainBar from '@/components/MainBar';
import Left from '@/components/Left';
import ToastBar from '@/components/ToastBar';
import * as types from './store/mutation-types';
export default {
  name: 'app',
  components: {
    Left,
    MainBar,
    ToastBar
  },
  data() {
    return {
      mock: true,
      border: false,
      qrschema: 'http://h5.m.taobao.com/ocean/ComponentList.htm',
      openlog: false,
      log: '',
      serverurl: location.href,
      isrunning: false,
      tips: null,
      projectName: 'Drop File Here',
      type: 'native',
    }
  },
  computed: {
    // a computed getter
    qrcode: function() {
      var url = 'http://' + location.host + '/js?uid=0'
      var newUrl = this.qrschema;
      newUrl += (this.qrschema.indexOf('?') != -1) ? '&' : '?';
      newUrl += 'url=' + encodeURIComponent(url) + '&test=1';
      if (this.type === 'js') {
        newUrl += '&type=js'
      }
      return newUrl;
    }
  },
  created() {
    // document.ondragover = document.ondrop = function(e) {
    //   e.preventDefault();
    //   return false;
    // };

    // this.qrschema = this.$.api.setting().qrschema;

    // var setting = this.$.api.setting()
    // this.$.ipc.on('tips', (event, arg) => {
    //   arg = JSON.parse(arg);
    //   this.showTips(arg.type, arg.msg);
    // });

    // this.$.ipc.on('log', (event, arg) => {
    //   arg = JSON.parse(arg);
    //   this.appendLog(arg.type, arg.msg);
    // });
    // this.$.ipc.on('newProject', (event, arg) => {
    //   arg = JSON.parse(arg);
    //   this.onProjectFinished(arg);
    // });
    // this.$.ipc.send('init');
  },
  methods: {
    onstart() {
      this.$.api.start();
      this.$.api.onUpdate((res) => {
        this.fetchRecorder();
      });
    },
    fetchRecorder() {
      this.$.api.getLastRecorders().then(res => {
        console.log(JSON.stringify(res));
        // this.$store.state.records = res;
        this.$store.commit('records', res);
      }).catch(err => {
        alert(err);
      });
    },
    onrecorder() {

    }
  }
}

</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.root {
  /*background-color: lightgray;*/
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.tool {
  height: 60px;
  /*background-color: cadetblue;*/
  /*background-color: rgb(47, 176, 242);*/
  background-color: #F9FAFC;
  flex-direction: row;
  display: flex;
  align-content: center;
  /*padding-top: 50px;*/
  align-items: flex-end;
  padding-bottom: 10px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  /*拖动区域禁止选择*/
}

.toolleft {
  display: flex;
  flex-direction: row;
  align-content: center;
  flex: 1;
  margin-left: 10px;
}

.toolitem {
  -webkit-app-region: no-drag;
  padding: 4px 8px 4px 4px;
  margin-right: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  /*height: 24px;*/
  color: antiquewhite;
}

.toolitem:hover {
  /*background-color: #428bca;*/
  background-color: rgb(47, 176, 242);
  color: white;
}

.enditem {
  justify-content: flex-end;
  /*-items: flex-end;*/
}

.icon {
  color: whitesmoke;
  font-size: 18px;
}

.itemtext {
  font-size: 12px;
  margin-left: 5px;
  text-align: center;
  cursor: default;
}

.qr {
  justify-content: center;
  align-items: center;
  display: flex;

  /*visibility: hidden;*/
}

#qrcode:hover {
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: row;
  /*align-items: center;*/
  /*justify-content: center;*/
  /* padding: 30px 20px 50px 20px; */
  /*background-color: white;*/
}

.left {
  width: 100px;
  /* background-color: red; */
}

.right {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rightcontent {
  width: 100%;
  /* height: 100%; */

  /* background-color: blue; */
  /* margin: 15px; */
  /* overflow-y: auto;
  overflow-x: auto; */
  background: #fff;
  /* padding-top: 20px; */
  /* border-radius: 4px; */
  flex: 1;
   /* flex-grow:2; */
   display: flex;
   flex-direction: column;
}

#dropproject {
  margin: 30px 20px 0px 20px;
  border: 2px dashed grey;
  height: 100px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
  -webkit-user-select: none;
}

#dropproject.hover {
  border-color: #2ab0cb;
}

.project {
  margin: 30px 20px 30px 20px;
  padding: 20px 20px 20px 20px;
  border: 2px dashed grey;
  height: 100px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.projectaction {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.projectactionitem {
  width: 22px;
  height: 22px;
  margin-left: 12px;
}

.droptip {
  font-size: 20px;
  margin-right: 20px;
  color: lightslategrey;
  word-break: normal | break-all | keep-all;
}

.bottom {
  -webkit-user-select: none;
  display: flex;
  flex-direction: row;
  /*justify-content: center;*/
  align-items: center;
  height: 36px;
  background-color: rgb(250, 250, 250);
  font-size: 12px;
  /*color:darkblue;*/
  text-align: left;
  padding-left: 10px;
  padding-right: 10px;
  /*background-repeat: repeat-x;*/
  /*background-image: -webkit-linear-gradient(top, white 0, #f8efc0 100%);
        background-image: -o-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
        background-image: -webkit-gradient(linear, left top, left bottom, from(#fcf8e3), to(#f8efc0));
        background-image: linear-gradient(to bottom, #fcf8e3 0, #f8efc0 100%);*/
}

.bottomtips {
  flex: 1;
}

.log {
  text-shadow: 0 1px 0 rgba(255, 255, 255, .2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25), 0 1px 2px rgba(0, 0, 0, .05);
  background-color: #fcf8e3;
  background-image: -webkit-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
  background-image: -o-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fcf8e3), to(#f8efc0));
  background-image: linear-gradient(to bottom, #fcf8e3 0, #f8efc0 100%);
  filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#fffcf8e3', endColorstr='#fff8efc0', GradientType=0);
  background-repeat: repeat-x;
  border: 1px solid transparent;
  /*border-radius: 4px;*/
  border-color: #f5e79e;
  /*padding-right: 35px;
        padding: 15px;*/
  padding: 4px 10px 4px 10px;
  /*padding: 0;*/
  position: fixed;
  bottom: 35px;
  left: 0px;
  /*right: 0px;*/
  height: 300px;
  width: 100%;
  color: #8a6d3b;
  font-size: 14px;
  resize: none;
}

.wanring {
  text-shadow: 0 1px 0 rgba(255, 255, 255, .2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25), 0 1px 2px rgba(0, 0, 0, .05);
  background-color: #fcf8e3;
  background-image: -webkit-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
  background-image: -o-linear-gradient(top, #fcf8e3 0, #f8efc0 100%);
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fcf8e3), to(#f8efc0));
  background-image: linear-gradient(to bottom, #fcf8e3 0, #f8efc0 100%);
  filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='#fffcf8e3', endColorstr='#fff8efc0', GradientType=0);
  background-repeat: repeat-x;
  border: 1px solid transparent;
  /*border-radius: 4px;*/
  border-color: #f5e79e;
  /*padding-right: 35px;
        padding: 15px;*/
  padding: 4px 10px 4px 10px;
  position: fixed;
  bottom: 36px;
  left: 0px;
  right: 0px;
  color: #8a6d3b;
  font-size: 14px;
}
</style>