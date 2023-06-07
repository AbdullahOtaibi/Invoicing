
var HashMap = require('hashmap');
const WebSocket = require("ws");

class WebSocketsManager {

  initSocket(ws){
    console.log('web-socket: new client connected.');
    //sockets.push(ws);

    // When you receive a message, send that message to every socket.
    ws.on('message', function (msg) {
      console.log('web-socket: new message received: ' + msg);
      //call handle Message
      let messageObject = JSON.parse(msg);
      if (messageObject.command === "bind-user") {
        console.log("Binding User [" + messageObject.email + "]");
        console.log("========================= THIS STARTS HERE ===============================");
        console.log(this.bindUserSocketByEmail);
        console.log("=========================  THIS ENDS HERE  ===============================");
        let userSockets = this.sockets.get(messageObject.email);
        if (!userSockets) {
          userSockets = [];
        }
        if (userSockets.filter(s => s == ws).length == 0) {
          userSockets.push(ws);
          this.sockets.set(messageObject.email, userSockets);
        }

        console.log(`userSockets.length: ${userSockets.length}`);


        console.log(`socket.size: ${this.sockets.size}`);



      }

    });

    // When a socket closes, or disconnects, remove it from the array.
    ws.on('close', function () {
      console.log('web-socket: client connection closed.');
      //delete ws
      this.removeSocket(ws);
    });
  }


  constructor(wss) {
    this.wss = wss;
    this.sockets = new HashMap();
    this.wss.on('connection', function (ws) { this.initSocket(ws); });



  }



 

  notifyAllUsers = function (notification) {
    try {
      sockets.forEach(function (userSockets, key) {
        userSockets.forEach(userSocket => {
          console.log('sending message via websocket  ' + JSON.stringify(notification));
          userSocket.send(JSON.stringify(notification));
        });
        // console.log(key + " : " + value);
      });
    } catch (e) {
      console.error(e);
    }
  }





  removeSocket = function (wsToDelete) {
    sockets.forEach(function (userSockets, key) {
      userSockets = userSockets.filter(ws => ws != wsToDelete);
      sockets.set(key, userSockets);
    });
  }


  handleServerNotification = function (notification) {
    try {
      if (notification.userEmail) {
        let userSockets = this.sockets.get(notification.userEmail);
        //console.log(`found ${userSockets.length} messages for user `);
        userSockets.forEach(s => {
          // console.log('sending message via websocket...');
          s.send(JSON.stringify(notification));
        });
      } else {
        this.notifyAllUsers(notification);
      }

    }
    catch (e) {
      console.error(e);
    }
  }



}


module.exports = WebSocketsManager; 