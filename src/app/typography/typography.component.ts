import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'typography.component.html'
})

export class TypographyComponent{
    parentform:FormGroup;
    formsubmitted = false;
    constructor(private formobj:FormBuilder) { }
  
    ngOnInit() {
      this.parentform=this.formobj.group({
        schoolname:["",Validators.required],
        bname:["",[Validators.required]],
        city:["",Validators.required],
        tmark:["",Validators.required],
        marks:["",Validators.required],
        grade:["",Validators.required],
        yop:["",Validators.required],
        subject:["",Validators.required],
        duration:["",Validators.required]
      })
    }
  
    pageValidate()
    {
      this.formsubmitted=true;
  
      if(this.parentform.invalid)
      {
       return;
  
      }else{
         alert("Hi Your Face data will be sumbmitted to server");
      }
    }
}
