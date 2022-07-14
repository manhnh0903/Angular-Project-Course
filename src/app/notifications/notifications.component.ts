import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { all } from 'q';
declare var $:any;

@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'notifications.component.html'
})

export class NotificationsComponent{
    constructor(private obj:HttpClient){}//new
   ngOnInit(){
       this.getnotification();
       
   } 
   allnot:any[];
   getnotification()
   {
       this.obj.get("./assets/notification.json").subscribe(
           data=>
       {
           this.allnot = data as string[];

       }
       )
   }   
}
