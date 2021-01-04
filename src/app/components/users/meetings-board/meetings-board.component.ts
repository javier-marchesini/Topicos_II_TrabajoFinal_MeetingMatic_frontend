import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, pipe } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IMeeting } from 'src/app/models/meeting.interface';
import { AccountType } from 'src/app/models/user-accountType.model';
import { AuthenticationService } from 'src/app/services';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { MeetingService } from 'src/app/services/meeting.service';





@Component({
    selector: 'app-meetings-board',
    templateUrl: './meetings-board.component.html',
    styleUrls: ['./meetings-board.component.css'],
    providers: [DecimalPipe]
})
export class MeetingsBoardComponent implements OnInit {

    public meetings: IMeeting[] = [];
    public filteredMeetings:IMeeting[] = [];

    public isFreeAccountType:Boolean  = false;
    public displayLoading: Boolean = false;
    public currentMonth:number = new Date().getUTCMonth()+1;

    public page = 1;
    public pageSize = 10;
    public collectionSize = 0;

    constructor(private _meetingService: MeetingService,
        private _meetingDataService: MeetingDataService,
        private _toastService: ToastrService,
        private _authenticationService: AuthenticationService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.getMeetings();
        this.isFreeAccountType = this._authenticationService.isFreeAccountType()
        

    }

    getMeetings() {
        this.displayLoading = true;
        this._meetingService.getMeetingAuthenticatedUser()
            .subscribe(
                response => { 
                    this.meetings = response;
                    this.collectionSize = this.meetings.length;
                    this.refreshTable();
                },
                error => { this._toastService.error('Ha ocurrido un error al obtener las meetings. Intente más tarde'); },
            )
            .add(() => this.displayLoading = false);
    }

    refreshTable() {
        this.filteredMeetings = this.meetings
            .map((meeting, i) => ({ number: i + 1, ...meeting }))
            .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
    
    viewDetailMeeting(i) {
        this._meetingDataService.setCurrentMeeting(this.meetings[i]);
        this.router.navigate(['meeting/detail']);
    }

    viewMatchesMeeting(i) {
        this._meetingDataService.setCurrentMeeting(this.meetings[i]);
        this.router.navigate(['meeting/admin'], { queryParams: { slug: this.meetings[i].privateSlug} });
    }

    enabledisableMeeting(i) {
        this.displayLoading = true;
        this._meetingService.getEnableDisableMeeting(this.meetings[i].id)
        .subscribe(
            response => {
                this.getMeetings();
            },
            (error: HttpErrorResponse) => {
                this._toastService.error('Ha ocurrido un error en la operación');
            })
        .add(() => this.displayLoading = false);
        
    }

    cloneMeeting(i) {
        if (this.isFreeAccountType && this.getTotalMeetingsCurrentMonth() >= 10 ){
            this._toastService.info('Haz llegado al limite de reuniones mensuales con la cuenta FREE');
            return
        }
            this.displayLoading = true;
            this._meetingService.putMeetingCloneById(this.meetings[i].id)
                .subscribe(
                    response => {
                        this.getMeetings();
                    },
                    (error: HttpErrorResponse) => {

                        this._toastService.error('Ha ocurrido un error al clonar');
                    })
                .add(() => this.displayLoading = false);

    }

    
  getTotalMeetingsCurrentMonth(){
        let meetingsCurrentMonth = this.meetings.filter(meeting => new Date(meeting.creationDate).getUTCMonth()+1 == new Date().getUTCMonth()+1);
        return meetingsCurrentMonth.length;
  }

}
