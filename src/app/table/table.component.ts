import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit{
    constructor(private obj:HttpClient){}
    ngOnInit()
    {
        this.getjobs();
    }
    alljobs:any[];
    p: number = 1;//pagination
    term: string;
    getjobs(){
        this.obj.get("./assets/joblist.json").subscribe(
            data=>{
                this.alljobs =data as string[];
            }
        )
    }
}
