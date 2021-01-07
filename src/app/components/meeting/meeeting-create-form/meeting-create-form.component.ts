import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi, FullCalendarComponent, DateSelectArg, EventClickArg } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MeetingService } from 'src/app/services/meeting.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { Rol } from 'src/app/models/rol.model';
import { Location } from '@angular/common'


@Component({
    selector: 'app-meeting-create-form',
    templateUrl: './meeting-create-form.component.html',
    styles: []
})
export class MeetingCreateFormComponent implements OnInit {

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild("modalDelete") modalDelete: TemplateRef<any>;

    public eventForm: FormGroup;
    public selectedEvent: any = null;
    public hasSession: Boolean = false;
    public displayLoading: Boolean = false;

    currentEvents: EventApi[] = [];
    calendarVisible = true;
    calendarOptions: CalendarOptions = {
        locale: esLocale,
        timeZone: 'local',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,listWeek'
        },
        views: {
            listWeek: { buttonText: 'Lista Semanal' },
            listYear: { buttonText: 'Lista Mensual' }
        },
        initialView: 'timeGridWeek',
        initialEvents: [],
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        height: 500,
        eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        slotLabelFormat: [
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }
        ]
    };

    constructor(private formBuilder: FormBuilder,
        private _meetingService: MeetingService,
        private _toastService: ToastrService,
        private _meetingDataService: MeetingDataService,
        private _authenticationService: AuthenticationService,
        private _modalService: NgbModal,
        private router: Router,
        private _location: Location
        

    ) {

        this.hasSession = this._authenticationService.sessionExists();
        if (this.hasSession && this._authenticationService.getRol() == Rol.ADMIN){
            this.router.navigate(['']);
            this._toastService.error('Acceso no autorizado');
        }

    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {

        if (this.hasSession) {

            this.eventForm = this.formBuilder.group({
                name: new FormControl(null, [Validators.required]),
                description: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required]),
                place: new FormControl(null, [Validators.required]),
                alternatives: new FormArray([]),

            });

        } else {

            this.eventForm = this.formBuilder.group({
                name: new FormControl(null, [Validators.required]),
                description: new FormControl('', [Validators.required]),
                password: new FormControl('', [Validators.required]),
                place: new FormControl(null, [Validators.required]),
                alternatives: new FormArray([]),
                additionalProp1: new FormGroup({
                    user: new FormGroup({
                        name: new FormControl(null, [Validators.required]),
                        email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
                    })
                })

            });
        }

    }

    getCalendarApi() {
        return this.calendarComponent.getApi()
    }

    handleCalendarToggle() {
        this.calendarVisible = !this.calendarVisible;
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        const calendarApi = selectInfo.view.calendar;

        let event = {
            id: Date.now().toString(),
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay
        }
        calendarApi.unselect();
        calendarApi.addEvent(event);

        if (new Date(selectInfo.startStr) < new Date() || new Date(selectInfo.startStr) < new Date()) {
            this._toastService.error('Fecha y Hora no válido');
            calendarApi.getEventById(event.id).remove();
        }

    }


    handleEventClick(clickInfo: EventClickArg) {
        this.selectedEvent = { "start": clickInfo.event.start, "end": clickInfo.event.end, }

        this._modalService.open(this.modalDelete, { ariaLabelledBy: 'modal-basic-title' })
            .result.then(
                (result) => {
                    clickInfo.event.remove();
                    this.selectedEvent = null;
                }, (reason) => {
                    this.selectedEvent = null;
                }
            );
    }

    onSubmit() {
        if (this.getCalendarApi().getEvents().length === 0) {
            this._toastService.error('No se han seleccionado los eventos');
            return
        }
        this.processAlternatives();

        this.displayLoading = true;

        if (this.hasSession) {

            this._meetingService.postMeetingAuth(this.eventForm.value)
                .subscribe(
                    response => {
                        this._meetingDataService.setCurrentMeeting(response);
                        this.router.navigate(['meeting/detail']);
                    },
                    (error: HttpErrorResponse) => {
                      
                        if (error.status == 400) {
                            this._toastService.error(error.error.error.message);
                        } else {
                            throw error;
                        }
                    })
                .add(() => this.displayLoading = false);

        } else {

            this._meetingService.postMeetingFree(this.eventForm.value)
                .subscribe(
                    response => {
                        this._meetingDataService.setCurrentMeeting(response);
                        this.router.navigate(['meeting/detail']);
                    },
                    (error: HttpErrorResponse) => {
                        if (error.status == 400) {
                            this._toastService.error(error.error.error.message);
                        } else {
                            throw error;
                        }
                    }
                )
                .add(() => this.displayLoading = false)
                
        }
    }


    alternativesForm(): FormArray {
        return this.eventForm.get("alternatives") as FormArray
    }

    processAlternatives() {
        this.alternativesForm().clear();
        this.getCalendarApi().getEvents().forEach(event => {
            this.alternativesForm().push(this.formBuilder.group({
                start: event.start,
                end: event.end
            }));
        })

    }
    cancelar() {
        this._location.back();
    }
}


