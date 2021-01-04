import {  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpBaseService {

	serverapi  = `${environment.apiUrl}`;
	
	constructor() {
		
	}

	httpOptionsPost = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
			Pragma: 'no-cache',
		})
	};
}
