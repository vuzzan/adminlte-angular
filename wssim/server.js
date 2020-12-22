"use strict";
const fs = require('fs');

const serverPort = 3000,
    http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    WebSocket = require("ws"),
    websocketServer = new WebSocket.Server({ server });

var continueSendLoopApplicationList = true
var continueSendLoopProcessList = true

function sendLoopApplicationList(wsClient, data){
    try{
        console.log("sendLoopApplicationList continueSendLoopApplicationList="+continueSendLoopApplicationList);
        if(continueSendLoopApplicationList==true)
            wsClient.send(data);
        if(continueSendLoopApplicationList==true)
            setTimeout(sendLoopApplicationList.bind(null,wsClient, data), 3000);
    }
    catch(error){
        console.log(error);
    }
}
function sendLoopProcessList(wsClient, data){
    try{
        console.log("sendLoopProcessList continueSendLoopProcessList="+continueSendLoopProcessList);
        if(continueSendLoopProcessList==true)
            wsClient.send(data);
        if(continueSendLoopProcessList==true)
            setTimeout(sendLoopProcessList.bind(null,wsClient, data), 3000);
    }
    catch(error){
        console.log(error);
    }
}

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
            continueSendLoopApplicationList = true;
            sendLoopApplicationList(webSocketClient, jsonResponse);
            //webSocketClient.send(jsonResponse);
        }
        else if(obj.txnName=="stopApplicationList"){
            console.log(obj.txnName);
            let rawdata = fs.readFileSync('json/stopApplicationList.json', 'utf8');
            continueSendLoopApplicationList = false;
            console.log("continueSendLoopApplicationList="+continueSendLoopApplicationList);
			//webSocketClient.send(rawdata);
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
            //
            continueSendLoopProcessList = true;
            sendLoopProcessList(webSocketClient, jsonResponse);
            //webSocketClient.send(jsonResponse);
        }
        else if(obj.txnName=="stopProcessList"){
            continueSendLoopProcessList = false;
            //console.log("RECV: "+obj.txnName);
            console.log("continueSendLoopProcessList="+continueSendLoopProcessList);
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
            console.log(obj.content);
 			let rawdata = fs.readFileSync('json/getProcessInfo.json', 'utf8');
            var jsonResponse = rawdata.replace(/SITEID/g, obj.content.siteId);
			jsonResponse = jsonResponse.replace(/PROCESSID/g, obj.content.processId);
            jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
            console.log("SEND: "+jsonResponse)
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