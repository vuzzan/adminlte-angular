import { Injectable, OnInit } from '@angular/core';
import Transaction from '../classes/transaction'
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import {environment} from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ConfigLoaderService } from '../config-loader.service';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { AppState } from '../interfaces/app-state';
import { Store } from '@ngrx/store';
import { AppSettings } from '../interfaces/settings';
import * as SettingsActions from '../store/actions/app-settings.actions';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit{
  private ws :ReconnectingWebSocket;
  socket_url:string;
  constructor(private toastr: ToastrService, private configLoaderService: ConfigLoaderService,private store: Store<AppState>) { 
    this.socket_url = this.configLoaderService.socket_url;
    console.log("constructor SocketService =this.configLoaderService.socket_url="+this.configLoaderService.socket_url);
    if(this.socket_url==''){
      this.socket_url = environment.socket_url;
    }
    if(!this.ws)
    {
      this.newConn();
    }
    
    //   else
    // return this.ws;
  }
  ngOnInit(): void {
    this.store.select('appSettings').subscribe(settings => {
    });
  }

  newConn (){
    console.log("New websocket: "+this.socket_url)
    var mystore = this.store;
    try {
      this.ws = new ReconnectingWebSocket(this.socket_url);
      console.log("OK New websocket: ")
      this.ws.addEventListener('close', function(ev:CloseEvent){
        console.log("CLOSE WS");
        var appSettings = {
          connectionStatus: "CLOSE",
        };
        mystore.dispatch(new SettingsActions.Update(appSettings));
      });
      this.ws.addEventListener('open', function(ev:Event){
        console.log("OPEN WS")
        var appSettings = {
          connectionStatus: "OPEN",
        };
        mystore.dispatch(new SettingsActions.Update(appSettings));
      });
    }
    catch(err) {
      console.log("Error");
      console.log(err);
      //this.toastr.error('loss connection', 'websocket');
      setTimeout(function(){
        console.log ("retry connect...3s....................");
        this.newConn(this.ws);
      }, 3000);
    }
  }

  show(msg:any){
    this.toastr.error(msg, 'Websocket');
  }

  preparetxn(txnName,content,token): Transaction {
    let txn = new Transaction();
    if(token === null)
    {
      var d = new Date();
      token = d.getFullYear().toString()+(d.getMonth()+1).toString()+d.getDate().toString()+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString()+d.getMilliseconds().toString();
    }
    txn.txnId = uuid.v4();
    txn.token = token;
    txn.userId = environment.user_id;
    txn.txnName = txnName;
    txn.txnDate = new Date().toString();
    txn.content = content;
    return txn;
  }

  initSend(name,content,token) : Promise<any>{
    console.log("initSend ");
    //if(this.ws.readyState !== WebSocket.OPEN)
        //this.ws = new WebSocket(environment.socket_url);
    return new Promise((resolve, reject) => {
      if(this.ws.readyState === WebSocket.OPEN)
        resolve(this.send(this.preparetxn(name,content,token)).catch(err=>{reject(err)}));
      this.ws.onopen = () => resolve(this.send(this.preparetxn(name,content,token)).catch(err=>{reject(err)}));
    });
  }

  continueSend(name,content,token): Promise<any>{
    return new Promise((resolve, reject) => {
      this.ws.onerror = (event) => reject(event);
      this.ws.onclose = (event) => reject(event);
      resolve(this.send(this.preparetxn(name,content,token)).catch(err=>{reject(err)}));
    });
  }

  protected send(txnObj) : Promise<any>{
    // if(this.ws.readyState !== WebSocket.OPEN)
    //     this.ws = new WebSocket(environment.socket_url);
    return new Promise((resolve, reject) => {
      if(this.ws.readyState === WebSocket.OPEN){
        console.log("Send Transaction:"+JSON.stringify(txnObj));
        resolve(this.ws.send(JSON.stringify(txnObj)));
      }
      else{
        reject("WebSocket is not in OPEN state.");
      }
    }
    );
  }

  public get() : Observable<Transaction> {
    return new Observable(subscriber => {
      this.ws.onmessage = (event) => {
        //console.log("Reply Transaction:"+event.data);
        subscriber.next(JSON.parse(event.data))};
    }
  )}
}
