import { Pipe, PipeTransform } from "@angular/core";
import { LoginType } from "src/app/models/app";

@Pipe({name:"mandateStatus"})
export class MandateStatusPipe implements PipeTransform{
    transform(value: any, args: any[]) {
        //console.log(args);
        if(args[1] == LoginType.SALESEXECUTIVE){
            if(args[0]?.toLowerCase() =="active"){
                /*if( value?.length < 10){
                    return value;
                }*/
                return 'XXXXXXX' + value.substring(value.length - 2);
            }
        }
        return value;
        //throw new Error("Method not implemented.");
    }
    
}