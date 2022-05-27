import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }
      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  // min has special character
  static minSpecialChar(min: number): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      if (min <= 0) {
        return null;
      }
      if (controls?.value) {
        const regex = new RegExp(/[\`\~\!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/gm);
        if (regex.test(controls.value)) {
          if (controls.value.match(regex).length < min) {
            return { minspecial: true };
          }
        }
        else if (min > 0) {
          return { minspecial: true };
        }
      }
      return null;
    };
  }

  // min has number
  static minNumberChar(min: number): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      if (min <= 0) {
        return null;
      }
      if (controls?.value) {
        const regex = new RegExp('[0-9]');
        if (regex.test(controls.value)) {
          if (controls.value.match(regex).length < min) {
            return { minnumber: true };
          }
        }
        else if (min > 0) {
          return { minnumber: true };
        }
      }
      return null;
    };
  }

  // min has upper case
  static minUpperCaseChar(min: number): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      if (min <= 0) {
        return null;
      }
      if (controls?.value) {
        const regex = new RegExp('[A-Z]');
        if (regex.test(controls.value)) {
          if (controls.value.match(regex).length < min) {
            return { minupper: true };
          }
        }
        else if (min > 0) {
          return { minupper: true };
        }
      }
      return null;
    };
  }

  // min has lower case
  static minLowerCaseChar(min: number): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      if (min <= 0) {
        return null;
      }
      if (controls?.value) {
        const regex = new RegExp('[a-z]');
        if (regex.test(controls.value)) {
          if (controls.value.match(regex).length < min) {
            return { minlower: true };
          }
        }
        else if (min > 0) {
          return { minlower: true };
        }
      }
      return null;
    };
  }
}