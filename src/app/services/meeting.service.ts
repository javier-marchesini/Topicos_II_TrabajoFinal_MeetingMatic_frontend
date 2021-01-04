import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';

import { IMeeting } from '../models/meeting.interface';

@Injectable({
    providedIn: 'root'
})
export class MeetingService extends HttpBaseService {


    private actionPath = `${this.serverapi}/meetings`;

    constructor(private http: HttpClient) {
        super();
    }

    getMeetings() {
        return this.http.get<IMeeting[]>(this.actionPath);
    }

    postMeetingFree(meeting: any) {
        return this.http.post<IMeeting>(this.actionPath, meeting, this.httpOptionsPost);
    }

    postMeetingAuth(meeting: any) {
        return this.http.post<IMeeting>(this.actionPath + '/auth', meeting, this.httpOptionsPost);
    }

    getMeetingByPrivateSlug(privateSlug: string) {
        return this.http.get<IMeeting>(this.actionPath + `/slug/${privateSlug}`);
    }

    getMeetingById(id: string) {
        return this.http.get<IMeeting>(this.actionPath + `/${id}`);
    }

    getMeetingByIdValidatePassword(id: string, password: string) {
        return this.http.get<IMeeting>(this.actionPath + `/validate/${id}/${password}`);
    }

    getMeetingAuthenticatedUser() {
        return this.http.get<IMeeting[]>(this.actionPath + '/auth');
    }

    getMeetingSimpleDataById(id) {
        return this.http.get<IMeeting>(this.actionPath + `/simpledata/${id}`);
    }

    deleteMeetingById(id) {
        return this.http.delete(this.actionPath + `/${id}`);
    }

    putMeetingCloneById(id) {
        return this.http.put(this.actionPath + `/clone/${id}`, null);
    }

    getMeetingsCount(filter) {

        return this.http.get<any>(this.actionPath + `/count?where=${filter}`);
    }

    getEnableDisableMeeting(id) {
        
        return this.http.get<IMeeting>(this.actionPath + `/enable-disable/${id}`);
    }






}
