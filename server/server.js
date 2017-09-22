const { app } = require('electron');
const express = require('express');
const path = require("path")
const net = require('net')


var server = express()
var dir = '../view';
if (process.env.NODE_ENV === 'development') {
  dir = '../client/dist'
}
server.use(express.static(path.resolve(__dirname, dir)));



// 检测port是否被占用
function probe(port, callback) {
  var server = net.createServer().listen(port)
  var calledOnce = false
  var timeoutRef = setTimeout(function () {
    calledOnce = true
    callback(false, port)
  }, 2000)

  timeoutRef.unref()
  var connected = false
  server.on('listening', function () {
    clearTimeout(timeoutRef)

    if (server)
      server.close()

    if (!calledOnce) {
      calledOnce = true
      callback(true, port)
    }
  })

  server.on('error', function (err) {
    clearTimeout(timeoutRef)

    var result = true
    if (err.code === 'EADDRINUSE')
      result = false

    if (!calledOnce) {
      calledOnce = true
      callback(result, port)
    }
  })
}


function localIp() {
  var os = require('os');
  var IPv4, hostName;
  hostName = os.hostname();
  var net = os.networkInterfaces();
  var en = net.en0 ? net.en0 : net.en1;
  for (var i = 0; i < en.length; i++) {
      en.forEach(function (v, index) {
          if (v.family == 'IPv4') {
              IPv4 = v.address;
          }
      });
  }


  return IPv4
}



function run(port) {
  probe(port, function (ret, port) {
    if (ret) {
      server.listen(port, function (r, q) {
        console.log('Example app listening on port' + port);
      });
      server.URL =  'http://' + localIp() + ':' + port;
    } else {
      run(port + 1);
    }
  });
}
server.start = function(port) {
  run(port)
}
module.exports.server = server;