import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions,  EventApi, FullCalendarComponent,  DateSelectArg, EventClickArg } from '@fullcalendar/angular';
import { IMeeting } from 'src/app/models/meeting.interface';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { environment } from 'src/environments/environment';
import esLocale from '@fullcalendar/core/locales/es';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services';
import { Location } from '@angular/common'


@Component({
	selector: 'app-meeting-view-detail',
	templateUrl: './meeting-view-detail.component.html',
	styles: []
})
export class MeetingViewDetailComponent implements AfterViewInit {

	public meeting: IMeeting = null;
	public adminUrl: string;
	public publicUrl:string;
    public hasSession:Boolean = false;
    
	@ViewChild('calendardetail') calendarComponent: FullCalendarComponent;
	
	calendarVisible = true;
	calendarOptions: CalendarOptions = {
        locale: esLocale,
        timeZone: 'local',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right:  'timeGridWeek,timeGridDay,listWeek'
		},
		views: {
			listWeek: { buttonText: 'Lista Semanal' },
			listYear: { buttonText: 'Lista Mensual' }
		},
		initialView: 'timeGridWeek',
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
				hour12:false
			}
		]
	};

	constructor(_meetingDataService:MeetingDataService,
                private _toastService:ToastrService,
                private _authenticationService: AuthenticationService,
                private _location: Location
                ) { 
		
        this.meeting = _meetingDataService.getCurrentMeeting();
        
        
        if (this.meeting != null){
            if (!this.hasSession){
                this.adminUrl = `${environment.serverUrl}/meeting/admin?slug=`+encodeURIComponent(this.meeting.privateSlug);
            }
            this.publicUrl = `${environment.serverUrl}/meeting/match/`+this.meeting.id;
            this.hasSession = this._authenticationService.sessionExists();
        }

	}
	ngAfterViewInit(): void {
        
        
        if (this.meeting != null){
            var minEventDate = this.meeting.alternatives.reduce(function (a, b) { return a.start < b.start ? a : b; }); 
            this.getCalendarApi().gotoDate(minEventDate.start);
            this.meeting.alternatives.forEach(event => {
                this.getCalendarApi().addEvent(event)
            });
        }
	}

	copyInputText(inputElement){
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
		this._toastService.success("Copiado al portapapeles");
	}

	copyInvitation(){
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.getTextInvitation();
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
		this._toastService.success("Copiado al portapapeles");
	}

	getTextInvitation(){
        
        let userEmail = (this.hasSession ? this.meeting.userAuth.email : this.meeting.userUnregistered.email);
        let userName = (this.hasSession ?  this.meeting.userAuth.name : this.meeting.userUnregistered.name);
        
        let mensaje = `
		${userName} (${userEmail}) lo está invitando a la organización de una reunión:
		
		- Nombre: ${this.meeting.name}
		- Descripción: ${this.meeting.description}
		- Lugar: ${this.meeting.place}
		- Acceso: ${this.publicUrl}
		- Password: ${this.meeting.password}

		`;
		return mensaje;
	}

	getCalendarApi() {
		return this.calendarComponent.getApi()
    }
    
    volver(){
        this._location.back();
    }

}


