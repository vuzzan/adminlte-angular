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
			//let json = JSON.parse(rawdata);
			webSocketClient.send(rawdata);
            //webSocketClient.send('{"txnId":"c89ce723-1fb6-4ebd-b456-85a78ad32e1d","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"RegisterClient","txnDate":"Thu Jan 16 2020 17:03:43 GMT+0800 (Singapore Standard Time)","content":{},"statusCode":200,"statusMsg":"OK"}');
        }
        else if(obj.txnName=="getSiteList"){
            console.log(obj.txnName);
			
			let rawdata = fs.readFileSync('json/getSiteList.json', 'utf8');
			webSocketClient.send(rawdata);
            //webSocketClient.send('{"txnId":"4e03f861-2738-4832-b9b6-113ed0c1c9ee","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"getSiteList","txnDate":"Thu Jan 16 2020 17:03:43 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":[{"siteId":"AMK","siteName":"AMK","siteState":"DOWN","info":[{"UP":71},{"DOWN":4}]}, {"siteId":"TEST","siteName":"TEST","siteState":"UP","info":[{"UP":71},{"DOWN":4}]}, {"siteId":"NEO","siteName":"NEO","siteState":"WARNING","info":[{"UP":71},{"DOWN":4}]}]}');
			//webSocketClient.send('{"txnId":"4e03f861-2738-4832-b9b6-113ed0c1c9ee","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"getSiteList","txnDate":"Thu Jan 16 2020 17:03:43 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":[{"siteId":"AMK","siteName":"AMK","siteState":"DOWN","info":[{"UP":71},{"DOWN":4}]}]}');
        }
        else if(obj.txnName=="getApplicationList"){
            console.log(obj.txnName);
            console.log("obj.siteId="+obj.content.siteId);
			let rawdata = fs.readFileSync('json/getApplicationList.json', 'utf8');
			webSocketClient.send(rawdata);

			//var jsonString = '{"txnId":"5ba29655-ba54-48c3-bcab-c5c8258a7791","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"getApplicationList","txnDate":"Thu Jan 16 2020 17:03:45 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":[{"appActions":["1. (Jsize<=5000)Monitor","2. (Jsize>5000) Inform DRI"],"applicationId":"AutoSched","applicationName":"AutoSched","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[1]},"applicationState":"UNKNOWN","info":[["LastUpdate","01/11/2019 15:56:48"]]},{"applicationId":"AutoSeparatorServer","applicationName":"AutoSeparatorServer","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]},{"applicationId":"CimWeb","applicationName":"CimWeb","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:43"]]},{"applicationId":"EQC-SAMx7350","applicationName":"EQC-SAMx7350","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:41"]]},{"applicationId":"EQC-SAMx7351","applicationName":"EQC-SAMx7351","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Red"]}],"labels":["DOWN"],"values":[1]},"applicationState":"DOWN","info":[["LastUpdate","30/09/2019 20:56:54"]]},{"applicationId":"EQC-SAMx7352","applicationName":"EQC-SAMx7352","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Red"]}],"labels":["DOWN"],"values":[1]},"applicationState":"DOWN","info":[["LastUpdate","30/09/2019 20:56:46"]]},{"applicationId":"EQC-SAMx7353","applicationName":"EQC-SAMx7353","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Red"]}],"labels":["DOWN"],"values":[1]},"applicationState":"DOWN","info":[["LastUpdate","30/09/2019 20:56:52"]]},{"applicationId":"HttpAOI","applicationName":"HttpAOI","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:38"]]},{"applicationId":"MTSETL_SERVER","applicationName":"MTSETL_SERVER","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]},{"applicationId":"MTSserver","applicationName":"MTSserver","applicationTotalProcessCount":2,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[2]},"applicationState":"UNKNOWN","info":[["LastUpdate","10/10/2019 14:45:24"]]},{"applicationId":"PackingServer","applicationName":"PackingServer","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]},{"applicationId":"PrintLabelGroup","applicationName":"PrintLabelGroup","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[1]},"applicationState":"UNKNOWN","info":[["LastUpdate","03/12/2019 15:58:21"]]},{"applicationId":"Promis","applicationName":"Promis","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[1]},"applicationState":"UNKNOWN","info":[["LastUpdate","30/10/2019 16:05:02"]]},{"applicationId":"PromisIC_SERVER","applicationName":"PromisIC_SERVER","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]},{"applicationId":"PromisTP","applicationName":"PromisTP","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:37"]]},{"applicationId":"PromsIC_SERVER","applicationName":"PromsIC_SERVER","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]},{"applicationId":"Replica-Stage","applicationName":"Replica-Stage","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:43"]]},{"applicationId":"SPACE","applicationName":"SPACE","applicationTotalProcessCount":27,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[27]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:42"]]},{"applicationId":"SPACExx","applicationName":"SPACExx","applicationTotalProcessCount":27,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[27]},"applicationState":"UNKNOWN","info":[["LastUpdate","01/10/2019 17:17:38"]]},{"applicationId":"Tibco-SAMx7354","applicationName":"Tibco-SAMx7354","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Red"]}],"labels":["DOWN"],"values":[1]},"applicationState":"DOWN","info":[["LastUpdate","21/11/2019 10:54:20"]]},{"applicationId":"Tibco-SAMx7355","applicationName":"Tibco-SAMx7355","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Coral"]}],"labels":["UNKNOWN"],"values":[1]},"applicationState":"UNKNOWN","info":[["LastUpdate","21/11/2019 10:54:23"]]},{"applicationId":"ToolLife_ETL","applicationName":"ToolLife_ETL","applicationTotalProcessCount":1,"applicationPieChartData":{"colors":[{"backgroundColor":["Chartreuse"]}],"labels":["UP"],"values":[1]},"applicationState":"UP","info":[["LastUpdate","16/01/2020 17:03:45"]]}]}';
			//webSocketClient.send(obj.content.siteId.length==0?jsonString:jsonString.replace(/SITEID/g, obj.content.siteId));
        }
        else if(obj.txnName=="stopApplicationList"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/stopApplicationList.json', 'utf8');
			webSocketClient.send(rawdata);
            //webSocketClient.send('{"txnId":"3ecc906e-df75-4851-82c3-db65d1c84c1b","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"stopApplicationList","txnDate":"Thu Jan 16 2020 17:10:30 GMT+0800 (Singapore Standard Time)","content":{},"statusCode":200,"statusMsg":"OK"}');
        }
        else if(obj.txnName=="getProcessList"){
            console.log(obj.txnName);
			let rawdata = fs.readFileSync('json/getProcessList.json', 'utf8');
            var jsonResponse = rawdata.replace(/SITEID/g, obj.content.siteId);
			jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
			webSocketClient.send(jsonResponse);

            //var jsonString = '{"txnId":"ef766936-095f-477e-b767-635983fded16","token":"eZLhoolwuzy+cfs2nCM70A==","userId":"masdashboard","txnName":"getProcessList","txnDate":"Thu Jan 16 2020 17:10:30 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":["processActions":["1. (Jsize<=5000)Monitor","2. (Jsize>5000) Inform DRI"],{"processId":"SITEIDAPPIDAutoSched-SAM2142","processName":"AutoSched-SAM2142","processState":"UP","info":[["AppGroup","AutoSched"],["AppName","AutoSched-SAM2142"],["Beacon","beacon"],["ComputerName","SAM2142"],["Ipv4Addr","10.132.112.42"],["KernelCpu","0"],["PID","7204"],["PeakWorkingSet","144674816"],["SiteId","AMK"],["State","Running"],["UserCpu","0"],["WorkingSet","144093184"],["fromEntity","AutoSched-SAM2142"],["nCPU","4"],["timeStamp","01-Nov-2019 15:56:48"]]},{"processId":"SITEIDAPPIDAutoSched-SAM2142","processName":"AutoSched-SAM2142","processState":"UP","info":[["AppGroup","AutoSched"],["AppName","AutoSched-SAM2142"],["Beacon","beacon"],["ComputerName","SAM2142"],["Ipv4Addr","10.132.112.42"],["KernelCpu","0"],["PID","7204"],["PeakWorkingSet","144674816"],["SiteId","AMK"],["State","Running"],["UserCpu","0"],["WorkingSet","144093184"],["fromEntity","AutoSched-SAM2142"],["nCPU","4"],["timeStamp","01-Nov-2019 15:56:48"]]},{"processActions":["1. (Jsize<=5000)Monitor","2. (Jsize>5000) Inform DRI"],"processId":"SITEIDAPPIDAutoSched-SAM2142","processName":"AutoSched-SAM2142","processState":"UP","info":[["AppGroup","AutoSched"],["AppName","AutoSched-SAM2142"],["Beacon","beacon"],["ComputerName","SAM2142"],["Ipv4Addr","10.132.112.42"],["KernelCpu","0"],["PID","7204"],["PeakWorkingSet","144674816"],["SiteId","AMK"],["State","Running"],["UserCpu","0"],["WorkingSet","144093184"],["fromEntity","AutoSched-SAM2142"],["nCPU","4"],["timeStamp","01-Nov-2019 15:56:48"]]}]}';
            //var jsonResponse = jsonString.replace(/SITEID/g, obj.content.siteId);
			//jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
            //webSocketClient.send(jsonResponse);
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
		}
        else if(obj.txnName=="getProcessInfo"){
            //console.log(obj.txnName);
			//var jsonString = '{"txnId":"d7018fde-cf9d-4886-8298-ee1bdb536daf","token":"zffDWpNP5V42P3ZPZAB7kQ==","userId":"masdashboard","txnName":" getProcessInfo","txnDate":"Fri Nov 27 2020 10:41:56 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":[{"processActions":["1. (Jsize<=5000)Monitor","2. (Jsize>5000) Inform DRI"],"processId":"PROCESSID","processName":"SITEID APPID","processState":"UP","info":[["LastUpdate","2020-11-27 10:41:20"],["Reason","Journal Size is Low : 0"],["status","UP"],["AppGroup","AutoSched"],["AppName","AutoSched-SAM2142"],["Beacon","beacon"],["ComputerName","SAM2142"],["Ipv4Addr","10.132.112.42"],["KernelCpu","0"],["PID","7204"],["PeakWorkingSet","144674816"],["SiteId","AMK"],["State","Running"],["UserCpu","0"],["WorkingSet","144093184"],["fromEntity","AutoSched-SAM2142"],["nCPU","4"],["timeStamp","01-Nov-2019 15:56:48"]]}],}';
			//var jsonString2 = '{"txnId":"d7018fde-cf9d-4886-8298-ee1bdb536daf","token":"zffDWpNP5V42P3ZPZAB7kQ==","userId":"masdashboard","txnName":" getProcessInfo","txnDate":"Fri Nov 27 2020 10:41:56 GMT+0800 (Singapore Standard Time)","statusCode":200,"statusMsg":"OK","content":["processId":"PROCESSID","processName":"SITEID APPID","processState":"UP","info":[["LastUpdate","2020-11-27 10:41:20"],["Reason","Journal Size is Low : 0"],["status","UP"],["AppGroup","AutoSched"],["AppName","AutoSched-SAM2142"],["Beacon","beacon"],["ComputerName","SAM2142"],["Ipv4Addr","10.132.112.42"],["KernelCpu","0"],["PID","7204"],["PeakWorkingSet","144674816"],["SiteId","AMK"],["State","Running"],["UserCpu","0"],["WorkingSet","144093184"],["fromEntity","AutoSched-SAM2142"],["nCPU","4"],["timeStamp","01-Nov-2019 15:56:48"]]}]}';
			let rawdata = fs.readFileSync('json/getProcessInfo.json', 'utf8');
            var jsonResponse = rawdata.replace(/SITEID/g, obj.content.siteId);
			jsonResponse = jsonResponse.replace(/PROCESSID/g, obj.content.processId);
			jsonResponse = jsonResponse.replace(/APPID/g, obj.content.applicationId);
			
            webSocketClient.send(jsonResponse);
        }
        
        //processRequest(obj);
        //for each websocket client
        // websocketServer
        // .clients
        // .forEach( client => {
        //     //send the client the current message
        //     //client.send(`{ "message" : ${message} }`);
        // });
    });
});

//start the web server
server.listen(serverPort, () => {
    console.log(`Websocket server started on port ` + serverPort);
});