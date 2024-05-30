import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit ,AfterViewInit{


  constructor(private router: Router) { }


  public students : any;

  public datasource :any ;

  public displayedColumns = ["id", "name", "lastname", "age" , "Payment"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    

    this.students = [];

    for (let i = 1; i < 20; i++) {
      
      this.students.push({

        id : i,
        name : "Name" + i.toString(20),
        lastname: "Lastname" + i.toString(20),
        age : Math.floor(Math.random() * 100),
      }
      );
    }

    this.datasource = new MatTableDataSource(this.students);
  }


  ngAfterViewInit(): void {

    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  
  }


  searchStudents(event: Event) {
   
    let value = (event.target as HTMLInputElement).value;
    this.datasource.filter = value.trim().toLowerCase();

    }


    getpayments(student: any) {
      this.router.navigateByUrl("/payment")
      }
  }


