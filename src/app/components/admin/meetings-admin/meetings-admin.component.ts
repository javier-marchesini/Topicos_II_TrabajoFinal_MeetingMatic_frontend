import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { IMeeting } from 'src/app/models/meeting.interface';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { MeetingService } from 'src/app/services/meeting.service';





@Component({
    selector: 'app-meetings-admin',
    templateUrl: './meetings-admin.component.html',
    styles: [
    ]
})
export class MeetingsAdminComponent implements OnInit {

    @ViewChild("modalDelete") modalDelete: TemplateRef<any>;

    public page = 1;
    public pageSize = 10;
    public collectionSize = 0;
    public displayLoading: Boolean = false;
    public selectedMeeting = null;


    public filteredMeetings: IMeeting[] = [];
    public meetings: IMeeting[] = [];

    constructor(private _meetingService: MeetingService,
        private _meetingDataService: MeetingDataService,
        private route: ActivatedRoute,
        private router: Router,
        private _modalService: NgbModal,
        private _toastrService: ToastrService
    ) {

    }

    ngOnInit(): void {
        this.getMeetings();
    }

    getMeetings() {
        this.displayLoading = true;
        this._meetingService.getMeetings()
            .subscribe(
                response => {
                    this.meetings = response;
                    this.collectionSize = this.meetings.length;
                    this.refreshTable();
                },
                (error: HttpErrorResponse) => {
                    return throwError(error);
                }
            )
            .add(() => this.displayLoading = false);
    }

    refreshTable() {
        this.filteredMeetings = this.meetings
            .map((meeting, i) => ({ number: i + 1, ...meeting }))
            .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }

    viewDetailMeeting(meetingId) {
        this.selectedMeeting = this.getSelectedMeeting(meetingId);
        this._meetingDataService.setCurrentMeeting(this.selectedMeeting);
        this.selectedMeeting = null;
        this.router.navigate(['meeting/detail']);
    }

    getSelectedMeeting(meetingId) {
        return this.meetings.filter(meeting => meeting.id === meetingId)[0];
    }


    deleteConfirmMeeting(meetingId) {
        this.selectedMeeting = this.getSelectedMeeting(meetingId);

        this._modalService.open(this.modalDelete, { ariaLabelledBy: 'modal-basic-title' })
            .result.then(
                (result) => {
                    this.deleteMeeting(this.selectedMeeting.id);
                    this.selectedMeeting = null;
                }, (reason) => {
                    this.selectedMeeting = null;
                }
            );

    }

    deleteMeeting(meetingId: string) {
        this.displayLoading = true;
        this._meetingService.deleteMeetingById(meetingId)
            .subscribe(
                (rta) => {
                    this.getMeetings();
                    this._toastrService.success('Ma meeting se eliminó exitosamente');
                },
                (err: HttpErrorResponse) => {
                    switch (err.status) {
                        case 400:
                            this._toastrService.error('Error en la solicitud de eliminar documento: ' + err.error.mensaje);
                            break;
                        case 404:
                            this._toastrService.error('No existe el documento que quiere eliminar');
                            break;
                    }
                }
            )
            .add(() => this.displayLoading = false);

    }

}
