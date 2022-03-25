import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Destroyed } from '../destroyed';

export abstract class SubFormComponent extends Destroyed {
  form: FormGroup;

  protected constructor(fb: FormBuilder) {
    super();
    this.form = this.createForm(fb);
  }

  protected abstract createForm(fb: FormBuilder): FormGroup;

  protected getCtrl(path: string) {
    return this.form.get(path) as FormControl;
  }

  protected getArray(path: string) {
    return this.form.get(path) as FormArray;
  }
}
