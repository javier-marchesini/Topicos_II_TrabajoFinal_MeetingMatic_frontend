import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { MeetingMatchService } from 'src/app/services/meeting-match.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { UserUnregisteredService } from 'src/app/services/user-unregistered.service';

@Component({
    selector: 'app-admin-board',
    templateUrl: './admin-board.component.html',
    styleUrls: ['./admin-board.component.css']
})
export class AdminBoardComponent implements OnInit {


    public totalUsuariosRegistrados: number = 0;
    public totalUsuariosNoRegistrados: number = 0;
    public totalMeetings: number = 0;
    public totalMeetingsMatches: number = 0;

    constructor(private _meetingService: MeetingService,
        private _userService: UserService,
        private _userUnregisteredService: UserUnregisteredService,
        private _meetingMatchesService: MeetingMatchService,

    ) { }

    ngOnInit(): void {
        this._meetingService.getMeetingsCount('')
            .subscribe(response => {
                this.totalMeetings = response.count;
            })
        this._userService.getUsersCount('')
            .subscribe(response => {
                this.totalUsuariosRegistrados = response.count;
            })
        this._userUnregisteredService.getUsersUnregisteredCount('')
            .subscribe(response => {
                this.totalUsuariosNoRegistrados = response.count;
            })
        this._meetingMatchesService.getMeetingMatchesCount('')
            .subscribe(response => {
                this.totalMeetingsMatches = response.count;
            })
    }

}
