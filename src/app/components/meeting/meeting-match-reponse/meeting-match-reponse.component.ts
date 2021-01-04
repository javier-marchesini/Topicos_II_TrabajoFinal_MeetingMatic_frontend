import { Component, OnInit } from '@angular/core';
import { IMeetingMatch } from 'src/app/models/meeting-match.interface';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { MeetingMatchService } from 'src/app/services/meeting-match.service';

@Component({
    selector: 'app-meeting-match-reponse',
    templateUrl: './meeting-match-reponse.component.html',
    styleUrls: []
})
export class MeetingMatchReponseComponent implements OnInit {

    meetingMatch: IMeetingMatch = null;

    constructor(private _meetingDataService: MeetingDataService) { }


    ngOnInit(): void {
        this.meetingMatch = this._meetingDataService.getMeetingMatch();
    }
}
