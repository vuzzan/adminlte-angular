import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  validateToken(token:String){
    if(token == environment.token){
      return true;
    }
    else
    return false;
  }
}
