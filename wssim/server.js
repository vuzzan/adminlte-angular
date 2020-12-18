"use strict";
const fs = require('fs');

const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws"),
    websocketServer = new WebSocket.Server({ server });

//when a websocket connection is established
websocketServer.on('connection', (webSocketClient) => {
    //send feedback to the incoming connection
    //webSocketClient.send('{ "connection" : "ok"}');
    webSocketClient.on('error', function(err){
        console.log(err)
    });
    //when a message is received
    webSocketClient.on('message', (message) => {
        console.log(`Recv ` + message);
        var obj = JSON.parse( message );
        //console.log(obj);
        //console.log(obj.txnName);
        if(obj.txnName=="RegisterClient"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/RegisterClient.json', 'utf8');
			console.log(rawdata);
			webSocketClient.send(rawdata);
        }
        else if(obj.txnName=="getSiteList"){
            console.log(obj.txnName);
			
			let rawdata = fs.readFileSync('json/getSiteList.json', 'utf8');
			webSocketClient.send(rawdata);
        }
        else if(obj.txnName=="getApplicationList"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/getApplicationList.json', 'utf8');
			var siteId = obj.content.siteId;
			if(obj.content.siteId.indexOf('ALL')>-1){
				siteId = 'AMK';
			}
			console.log('siteId='+siteId);
            var jsonResponse = rawdata.replace(/SITEID/g, siteId);
			webSocketClient.send(jsonResponse);
        }
        else if(obj.txnName=="stopApplicationList"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/stopApplicationList.json', 'utf8');
			webSocketClient.send(rawdata);
        }
        else if(obj.txnName=="getProcessList"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/getProcessList.json', 'utf8');
			var siteId = obj.content.siteId;
			if(obj.content.siteId.indexOf('ALL')>-1){
				siteId = 'AMK';
			}
			console.log('siteId='+siteId);
            var jsonResponse = rawdata.replace(/SITEID/g, siteId);
			jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
			webSocketClient.send(jsonResponse);
        }
        else if(obj.txnName=="stopProcessList"){
            console.log("RECV: "+obj.txnName);
        }
        else if(obj.txnName=="stopProcessInfo"){
            console.log("RECV: "+obj.txnName);
		}
        else if(obj.txnName=="doAction"){
            console.log("RECV: "+obj.txnName);
            console.log("\t siteId= "+obj.content.siteId);
            console.log("\t applicationId= "+obj.content.applicationId);
            console.log("\t processName= "+obj.content.processName);
            console.log("\t action= "+obj.content.action);
			let rawdata = fs.readFileSync('json/doAction.json', 'utf8');
			webSocketClient.send(rawdata);
			console.log("REP: "+rawdata);

		}
        else if(obj.txnName=="getProcessInfo"){
 			let rawdata = fs.readFileSync('json/getProcessInfo.json', 'utf8');
            var jsonResponse = rawdata.replace(/SITEID/g, obj.content.siteId);
			jsonResponse = jsonResponse.replace(/PROCESSID/g, obj.content.processId);
			jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
            webSocketClient.send(jsonResponse);
        }
        else if(obj.txnName=="getApplicationInfo"){
           let rawdata = fs.readFileSync('json/getApplicationInfo.json', 'utf8');
           var jsonResponse = rawdata.replace(/SITEID/g, obj.content.siteId);
           jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
           webSocketClient.send(jsonResponse);
       }
    });
});

//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});