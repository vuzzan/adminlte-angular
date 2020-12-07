import { Injectable } from '@angular/core';
import Transaction from '../classes/transaction'
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private ws :any;

  constructor() { 
    if(!this.ws)
    {
      console.log("1New websocket: " +environment.socket_url)
      this.newConn(this.ws);
    }
      else
    return this.ws;
  }

  newConn (ws:any){
    console.log("New websocket: " +environment.socket_url)
    //ws = new WebSocket(environment.socket_url);
    try {
      this.ws = new WebSocket(environment.socket_url);
      this.ws.onclose = function(){
        /// try to reconnect websocket in 5 seconds
        console.log ("loss connection");
        setTimeout(function(){
          console.log ("retry connect...3s....................");
          this.newConn(this.ws);
        }, 3000);
      };
      this.ws.onopen = function () {
        console.log('WebSocket connected')
      }
    }
    catch(err) {
      console.log("Error");
      setTimeout(function(){
        console.log ("retry connect...3s....................");
        this.newConn(this.ws);
      }, 3000);
    }
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
    if(this.ws.readyState !== WebSocket.OPEN)
        this.ws = new WebSocket(environment.socket_url);
    return new Promise((resolve, reject) => {
    if(this.ws.readyState === WebSocket.OPEN){
      console.log("Send Transaction:"+JSON.stringify(txnObj));
      resolve(this.ws.send(JSON.stringify(txnObj)));
    }
    else
    reject("WebSocket is not in OPEN state.");
    });
  }

  public get() : Observable<Transaction> {
    return new Observable(subscriber => {
      this.ws.onmessage = (event) => {
        //console.log("Reply Transaction:"+event.data);
        subscriber.next(JSON.parse(event.data))};
    }
  )}
}
