import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient } from '@angular/common/http';   //new 
declare var $:any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{
  constructor(private obj:HttpClient){}//new
    ngOnInit(){
      this.getdashdata();   //new
        
    }//ngoninit end here
    ddata:any[];
    getdashdata()
    {
     this.obj.get("./assets/dashboard.json").subscribe(
       data=>
       {
         this.ddata=data as string[];
       }
     )
    }
}
