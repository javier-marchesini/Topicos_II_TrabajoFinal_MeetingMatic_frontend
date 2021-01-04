import { Injectable } from '@angular/core';
import { IMeetingMatch } from '../models/meeting-match.interface';
import { IMeeting } from '../models/meeting.interface';

@Injectable({
  providedIn: 'root'
})
export class MeetingDataService {

 
  private currentMeeting: IMeeting;
  private meetings : IMeeting [];
  private meetingMatch : IMeetingMatch;

  constructor() { }


  getCurrentMeeting(){
    return this.currentMeeting;
  }

  setCurrentMeeting(meeting){
    this.currentMeeting = meeting;
  }

  setMeetings(meetings){
    this.meetings = meetings;
  }
  
  getMeetings(){
    return this.meetings;
  }
  
  getMeetingMatch(){
      return this.meetingMatch;
  }

  setMeetingMatch(meetingMatch){
      this.meetingMatch = meetingMatch;
  }

}
