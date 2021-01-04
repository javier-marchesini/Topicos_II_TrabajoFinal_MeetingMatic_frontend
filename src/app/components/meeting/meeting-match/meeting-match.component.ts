import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventApi, CalendarOptions, DateSelectArg, EventClickArg, FullCalendarComponent } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import esLocale from '@fullcalendar/core/locales/es';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { MeetingMatchService } from 'src/app/services/meeting-match.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-meeting-match',
    templateUrl: './meeting-match.component.html',
    styles: []
})
export class MeetingMatchComponent implements  AfterViewInit {

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    public meeting = null;
    public matchForm: FormGroup;
    public eventClicked = false;
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
        initialView: 'listWeek',
        initialEvents: [],
        weekends: true,
        editable: false,
        selectable: false,
        selectMirror: true,
        dayMaxEvents: true,
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
        private _meetingMatchService: MeetingMatchService,
        private _toastService: ToastrService,
        private _meetingDataService: MeetingDataService,
        private router: Router,
    ) {

        this.meeting = this._meetingDataService.getCurrentMeeting();

        if (this.meeting != undefined) {
            this.createForm();
        } else {
            this.router.navigate(['']);
        }

    }


    ngAfterViewInit(): void {
        var minEventDate = this.meeting.alternatives.reduce(function (a, b) { return a.start < b.start ? a : b; }); 
        this.getCalendarApi().gotoDate(minEventDate.start);
        this.getCalendarApi().addEventSource(this.meeting.alternatives);
    }

    createForm() {

        this.matchForm = this.formBuilder.group({
            meetingId: new FormControl(this.meeting.id, [Validators.required]),
            alternativesMatched: new FormArray([], Validators.required),
            additionalProp1: new FormGroup({
                user: new FormGroup({
                    name: new FormControl(null, [Validators.required]),
                    email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
                })
            })
        });

    }

    getCalendarApi() {
        return this.calendarComponent.getApi()
    }

    alternativesForm(): FormArray {
        return this.matchForm.get("alternativesMatched") as FormArray
    }


    getEventsMatched() {
        return this.getCalendarApi().getEvents().filter(function (event) {
            return event.extendedProps.selected;
        });
    }


    processAlternatives() {
        this.alternativesForm().clear();
        this.getEventsMatched().forEach(event => {
            this.alternativesForm().push(this.formBuilder.group({
                start: event.start,
                end: event.end
            }));
        })
    }

    handleEventClick(clickInfo: EventClickArg) {
        this.eventClicked = true;
        let event = clickInfo.event;

        if (!event.extendedProps.selected) {
            event.setExtendedProp("selected", true);
            event.setProp("backgroundColor", 'green')
            event.setProp("title", 'CONFIRMADO')
        } else {
            event.setExtendedProp("selected", false);
            event.setProp("backgroundColor", null);
            event.setProp("title", '');
        }

        this.processAlternatives();
    }

    getConfirmedEvents() {
        return this.getCalendarApi().getEvents().filter(function (event) {
            return event.extendedProps.selected;
        });
    }

    onSubmit() {
        if (this.getEventsMatched().length === 0) {
            this._toastService.error('No has matcheado con los eventos.');
            return
        }
        this.displayLoading = true;

        this._meetingMatchService.postMeetingMatchFree(this.matchForm.value)
            .subscribe(
                response => {
                    this._meetingDataService.setMeetingMatch(response);
                    this.router.navigate(['match/response']);
                },
                (error: HttpErrorResponse) => {
                    return throwError(error);
                })
            .add(() => this.displayLoading = false);

    }

}

