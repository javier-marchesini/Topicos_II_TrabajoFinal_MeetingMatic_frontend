import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpBaseService } from './http-base.service';


@Injectable({ providedIn: 'root' })
export class UserUnregisteredService extends HttpBaseService {
   
    constructor(private http: HttpClient) {
        super();
     }
    
    private actionPath = `${this.serverapi}/user-unregistereds`;
    
    getUsersUnregistered() {
        return this.http.get<any[]>(this.actionPath);
    }
   
    getUsersUnregisteredCount(filter) {
        return this.http.get<any>(this.actionPath + `/count?where=${filter}`);
    }
}