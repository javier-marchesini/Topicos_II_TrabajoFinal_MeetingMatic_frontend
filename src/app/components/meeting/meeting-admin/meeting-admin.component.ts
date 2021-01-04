import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import { throwError } from 'rxjs';
import { IMeetingMatch } from 'src/app/models/meeting-match.interface';
import { IMeeting } from 'src/app/models/meeting.interface';
import { MeetingMatchService } from 'src/app/services/meeting-match.service';
import { MeetingService } from 'src/app/services/meeting.service';
import esLocale from '@fullcalendar/core/locales/es';
import { Location } from '@angular/common'


@Component({
    selector: 'app-meeting-admin',
    templateUrl: './meeting-admin.component.html',
    styles: []
})
export class MeetingAdminComponent implements OnInit {

    private meetingPrivateSlug: string = null;
    public meeting: IMeeting = null
    public meetingMatches: IMeetingMatch[] = [];
    public colors: string[] = [];
    public users: any[] = [];
    public displayLoading: Boolean = false;



    @ViewChild('calendardetail') calendarComponent: FullCalendarComponent;

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
        height: 500,
        eventTimeFormat: {
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

    constructor(private route: ActivatedRoute,
        private router: Router,
        private _meetingService: MeetingService,
        private _meetingMatchService: MeetingMatchService,
        private activatedRoute: ActivatedRoute,
        private _location: Location

    ) { }


    ngOnInit(): void {

        this.route.paramMap.subscribe(params => {
            this.meetingPrivateSlug = this.activatedRoute.snapshot.queryParams.slug;
        });
        this.displayLoading = true;
        this._meetingService.getMeetingByPrivateSlug(encodeURIComponent(this.meetingPrivateSlug))
            .subscribe(
                response => {
                    this.meeting = response;
                    this.getMeetingMatches();
                },
                (error: HttpErrorResponse) => {
                    return throwError(error);

                }
            )
            .add(() => this.displayLoading = false);
    }

    getCalendarApi() {
        return this.calendarComponent.getApi()
    }

    getMeetingMatches() {
        this._meetingMatchService.getMeetingMatches(this.meeting.id)
            .subscribe(
                response => {
                    this.meetingMatches = response;
                    this.processCalendar();
                },
                (error: HttpErrorResponse) => {
                    return throwError(error);
                }
            )
    }


    processCalendar() {
        var minEventDate = this.meeting.alternatives.reduce(function (a, b) { return a.start < b.start ? a : b; }); 
        this.getCalendarApi().gotoDate(minEventDate.start);
        this.meeting.alternatives.forEach(alternative => {
            let event = {
                "start": alternative.start,
                "end": alternative.end,
                "title": " --- HORARIO PROPUESTO ---",
            }
            this.getCalendarApi().addEvent(event);
        });


        this.meetingMatches.forEach(match => {

            let title = match.userUnregistered.name;
            let color = this.generateRandomColor();

            this.users.push({
                "name": match.userUnregistered.name,
                "email": match.userUnregistered.email,
                "color": color,
            });

            match.alternativesMatched.forEach(matchedAlternative => {

                let event = {
                    "start": matchedAlternative.start,
                    "end": matchedAlternative.end,
                    "title": title,
                    "color": color,
                }
                this.getCalendarApi().addEvent(event);


            });
        });
    }

    volver() {
        this._location.back();
    }
    generateRandomColor() {
        return this.getRandomColor().hslaValue;

    }



    getRandomColor() {
        let h = [0, 360];
        let s = [90, 100];
        let l = [0, 90];
        let a = [1, 1];
        var hue = this.getRandomNumber(h[0], h[1]);
        var saturation = this.getRandomNumber(s[0], s[1]);
        var lightness = this.getRandomNumber(l[0], l[1]);
        var alpha = this.getRandomNumber(a[0] * 100, a[1] * 100) / 100;

        return {
            h: hue,
            s: saturation,
            l: lightness,
            a: alpha,
            hslaValue: this.getHSLAColor(hue, saturation, lightness, alpha)
        }
    }

    getRandomNumber(low, high) {
        var r = Math.floor(Math.random() * (high - low + 1)) + low;
        return r;
    }

    getHSLAColor(h, s, l, a) {
        return `hsl(${h}, ${s}%, ${l}%, ${a})`;
    }



}
