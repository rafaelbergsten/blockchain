/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SicknoteService } from './Sicknote.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-sicknote',
  templateUrl: './Sicknote.component.html',
  styleUrls: ['./Sicknote.component.css'],
  providers: [SicknoteService]
})
export class SicknoteComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  sickNoteID = new FormControl('', Validators.required);
  description = new FormControl('', Validators.required);
  cid = new FormControl('', Validators.required);
  doctor = new FormControl('', Validators.required);
  pacient = new FormControl('', Validators.required);

  constructor(public serviceSicknote: SicknoteService, fb: FormBuilder) {
    this.myForm = fb.group({
      sickNoteID: this.sickNoteID,
      description: this.description,
      cid: this.cid,
      doctor: this.doctor,
      pacient: this.pacient
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceSicknote.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Sicknote',
      'sickNoteID': this.sickNoteID.value,
      'description': this.description.value,
      'cid': this.cid.value,
      'doctor': this.doctor.value,
      'pacient': this.pacient.value
    };

    this.myForm.setValue({
      'sickNoteID': null,
      'description': null,
      'cid': null,
      'doctor': null,
      'pacient': null
    });

    return this.serviceSicknote.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'sickNoteID': null,
        'description': null,
        'cid': null,
        'doctor': null,
        'pacient': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.mynetwork.Sicknote',
      'description': this.description.value,
      'cid': this.cid.value,
      'doctor': this.doctor.value,
      'pacient': this.pacient.value
    };

    return this.serviceSicknote.updateAsset(form.get('sickNoteID').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceSicknote.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceSicknote.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'sickNoteID': null,
        'description': null,
        'cid': null,
        'doctor': null,
        'pacient': null
      };

      if (result.sickNoteID) {
        formObject.sickNoteID = result.sickNoteID;
      } else {
        formObject.sickNoteID = null;
      }

      if (result.description) {
        formObject.description = result.description;
      } else {
        formObject.description = null;
      }

      if (result.cid) {
        formObject.cid = result.cid;
      } else {
        formObject.cid = null;
      }

      if (result.doctor) {
        formObject.doctor = result.doctor;
      } else {
        formObject.doctor = null;
      }

      if (result.pacient) {
        formObject.pacient = result.pacient;
      } else {
        formObject.pacient = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'sickNoteID': null,
      'description': null,
      'cid': null,
      'doctor': null,
      'pacient': null
      });
  }

}
