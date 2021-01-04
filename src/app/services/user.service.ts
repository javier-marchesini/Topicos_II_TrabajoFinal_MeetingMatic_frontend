import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpBaseService } from './http-base.service';


@Injectable({ providedIn: 'root' })
export class UserService extends HttpBaseService {
   
    constructor(private http: HttpClient) {
        super();
     }
    
    private actionPath = `${this.serverapi}/users`;
    
    getUsers() {
        return this.http.get<any[]>(this.actionPath);
    }
   
    getUsersCount(filter) {
        return this.http.get<any>(this.actionPath + `/count?where=${filter}`);
    }

    
}