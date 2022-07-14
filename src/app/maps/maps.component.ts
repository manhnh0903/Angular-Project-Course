import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'map-cmp',
    moduleId: module.id,
    templateUrl: 'map.component.html'
})
export class MapComponent{
    parentform:FormGroup;
    formsubmitted = false;
    constructor() { }

  ngOnInit() {
  
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

