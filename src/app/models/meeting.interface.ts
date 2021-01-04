import { Alternative } from "./alternative.model"

export interface IMeeting {

    id:string;
    name: string;
    description: string;
    place: string;
    privateSlug:string;
    password?: string;
    additionalProp1?:any
    creationDate:Date,
    type:string;
    enable:boolean;
    userUnregisteredId?:string;
    userUnregistered?:any;
    userAuth?:any;
    alternatives: Alternative[];

  }

