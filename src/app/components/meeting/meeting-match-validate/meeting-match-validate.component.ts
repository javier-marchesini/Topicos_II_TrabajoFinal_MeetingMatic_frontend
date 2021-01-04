import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { constructor } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { throwError } from 'rxjs';
import { IMeeting } from 'src/app/models/meeting.interface';
import { MeetingDataService } from 'src/app/services/meeting-data.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-meeting-match-validate',
  templateUrl: './meeting-match-validate.component.html',
  styleUrls: []
})
export class MeetingMatchValidateComponent implements OnInit {

	meetingId = null;
    meetingForm = null;
    public meeting:IMeeting = null;
    public displayLoading: Boolean = false;
    public enabledMeeting = null;
  	constructor(private formBuilder: FormBuilder,
				private _meetingService:MeetingService,
				private _toastService:ToastrService,
				private _meetingDataService:MeetingDataService,
				private route: ActivatedRoute,
				private router: Router,
	) {	

    }

  ngOnInit(): void {
  
	this.route.paramMap.subscribe(params => {
        this.meetingId = params.get("meetingId")
        this.displayLoading = true;

        this._meetingService.getMeetingSimpleDataById(this.meetingId)
        .subscribe(
            response =>{ 
                this.meeting = response; 
                this.enabledMeeting = this.meeting.enable;

            },
            error => throwError(error)
        )
        .add(() => this.displayLoading = false);
	});

	this.meetingForm = this.formBuilder.group({
		meetingId: new FormControl(this.meetingId),
		password: new FormControl('',[Validators.required]),
	});

  }


  onSubmit(){

    this.displayLoading = true;

	this._meetingService.getMeetingByIdValidatePassword(this.meetingForm.get('meetingId').value, this.meetingForm.get('password').value)
		.subscribe(
				response => {
                    this._meetingDataService.setCurrentMeeting(response);
                    this.router.navigate(['meeting/match']);
                    
				},
				error => {
					if (error.status === 400 ){
						this._toastService.error(error.error.error.message)
					}else{
						return throwError(error);
					}
                }
                
                )
        .add(() => this.displayLoading = false);
  }

}
