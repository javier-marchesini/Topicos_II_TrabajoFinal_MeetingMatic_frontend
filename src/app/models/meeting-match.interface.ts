import { Alternative } from "./alternative.model"
import { IMeeting } from './meeting.interface';

export interface IMeetingMatch {

    id:string;
    alternativesMatched: Alternative[];
    meetingId?: string;
    creationDate:Date,
    userUnregisteredId?:string;
    userUnregistered?:any;
    meeting:IMeeting;

  }


