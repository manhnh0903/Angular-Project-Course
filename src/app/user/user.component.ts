import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpBackend } from '@angular/common/http';
@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit{
    constructor(private obj:HttpClient)
    {

    }
    ngOnInit(){
        this.getprofile();
    }
    pdata:any[];
    getprofile()
    {
       this.obj.get("./assets/userprofile.json").subscribe(
          data => {
               this.pdata=data as string[];
           }
       )
    }
}
