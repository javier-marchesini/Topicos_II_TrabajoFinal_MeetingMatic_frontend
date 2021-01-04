import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMeetingMatch } from '../models/meeting-match.interface';
import { HttpBaseService } from './http-base.service';

@Injectable({
    providedIn: 'root'
})
export class MeetingMatchService  extends HttpBaseService{

    private actionPath = `${this.serverapi}/meeting-matches`;

    constructor(private http: HttpClient) { 
        super()
    }
    
    postMeetingMatchFree(meetingMatch: any) {
        return this.http.post<IMeetingMatch>(this.actionPath, meetingMatch, this.httpOptionsPost);
    }

    getMeetingMatches(meetingId: string) {
        return this.http.get<IMeetingMatch[]>(this.actionPath + `/meeting/${meetingId}`);
    }

    getMeetingMatchesCount(filter) {
        return this.http.get<any>(this.actionPath + `/count?where=${filter}`);
    }
    
}
