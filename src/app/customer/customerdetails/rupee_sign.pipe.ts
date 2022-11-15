import { Pipe, PipeTransform } from "@angular/core";
import { LoginType } from "src/app/models/app";

@Pipe({name:"rupeeSign"})
export class RupeeSignPipe implements PipeTransform{
    transform(value: any) {
        if(value){
            return '₹' + value;
        }
        return '-';
    }
    
}