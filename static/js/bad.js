// console.log("running scan!");

// var ports = [80, 443, 445, 554, 3306, 3690, 1234];
// for (var i = 0; i < ports.length; i++) {
//   var ws = new WebSocket("ws://localhost:" + ports[i]);
//   ws.start = performance.now();
//   ws.port = ports[i];
//   ws.onerror = function() { 
//     var time = (performance.now() - this.start)
//     console.log(
//       "Port " + this.port + ": " + time + " ms" + " ws state " + ws.readyState + " " + check_status(time, ws.readyState)
//     );
//   };
//   ws.onopen = function() {
//     var time = (performance.now() - this.start)
//     console.log(
//       "Port " + this.port + ": " + time + " ms" + " ws state " + ws.readyState + " OPEN!"
//     );
//     ws.close();
//   };
// }

// function check_status(time, state)
// {
//     var closed_grace_period = 100
//     if(state === 3 || state === 4)
//     {
//         return "port open"
//     }
//     else if(state === 0 || state === 1)
//     {
//         if(time > 3000)
//         {
//             return "port filtered"
//         }
//         else if(time < 100)
//         {
//             return "port open"
//         }
//         else if(1000 + closed_grace_period > time && 1000 - closed_grace_period < time) // time is around 1000 ms
//         {
//             return "port closed"
//         }
//         else
//         {
//             return "port unknown"
//         }
//     }
// }

// // Make the function wait until the connection is made...
// function waitForSocketConnection(socket, callback){
//     setTimeout(
//         function () {
//             if (socket.readyState === 1) {
//                 console.log("Connection is made")
//                 if (callback != null){
//                     callback();
//                 }
//             } else {
//                 console.log("wait for connection...")
//                 waitForSocketConnection(socket, callback);
//             }
//         }, 5); // wait 5 milisecond for the connection...
// }

// Author: Nikolai Tschacher
// tested on Chrome v86 on Ubuntu 18.04
var portIsOpen = function(hostToScan, portToScan, N) {
    return new Promise((resolve, reject) => {
      var portIsOpen = 'unknown';
  
      var timePortImage = function(port) {
        return new Promise((resolve, reject) => {
          var t0 = performance.now()
          // a random appendix to the URL to prevent caching
          var random = Math.random().toString().replace('0.', '').slice(0, 7)
          var img = new Image;
  
          img.onerror = function() {
            var elapsed = (performance.now() - t0)
            // close the socket before we return
            resolve(parseFloat(elapsed.toFixed(3)))
          }
  
          img.src = "http://" + hostToScan + ":" + port + '/' + random + '.png'
        })
      }
  
      const portClosed = 37857; // let's hope it's closed :D
  
      (async () => {
        var timingsOpen = [];
        var timingsClosed = [];
        for (var i = 0; i < N; i++) {
          timingsOpen.push(await timePortImage(portToScan))
          timingsClosed.push(await timePortImage(portClosed))
        }
  
        var sum = (arr) => arr.reduce((a, b) => a + b);
        var sumOpen = sum(timingsOpen);
        var sumClosed = sum(timingsClosed);
        var test1 = sumOpen >= (sumClosed * 1.3);
        var test2 = false;
  
        var m = 0;
        for (var i = 0; i <= N; i++) {
          if (timingsOpen[i] > timingsClosed[i]) {
            m++;
          }
        }
        // 80% of timings of open port must be larger than closed ports
        test2 = (m >= Math.floor(0.8 * N));
  
        portIsOpen = test1 && test2;
        resolve([portIsOpen, m, sumOpen, sumClosed]);
      })();
    });
  }
  
  var ports = [80, 443, 445, 554, 3306, 3690, 1234];
for (var i = 0; i < ports.length; i++) {
    var port = ports[i]
    portIsOpen('localhost', port, 30).then((res) => {
        let [isOpen, m, sumOpen, sumClosed] = res;
        console.log("Is localhost: " + port + " open? " + isOpen);
    })
}

// https://incolumitas.com/2021/01/10/browser-based-port-scanning/