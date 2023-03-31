import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subscription } from 'rxjs';
import { TosDialogStatus } from './enums/tosDialogStatus';
import {
  Country,
  CountryStateFetcherService,
  State,
} from './services/country-state-fetcher.service';
import { TosRequestData, TosService } from './services/tos.service';
import { User, UserService } from './services/user.service';
import { TosDialogComponent } from './tos-dialog/tos-dialog.component';
import { confirmPasswordValidator } from './utils/confirm-password-validator';
import { CustomErrorStateMatcher } from './utils/error-state-matcher';

@Component({
  selector: 'mp-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [{ provide: ErrorStateMatcher, useClass: CustomErrorStateMatcher }],
})
export class SignupComponent implements OnInit, OnDestroy {
  countries?: Country[];
  states?: State[];
  countriesLoading = false;
  statesLoading = false;
  tosIsLoading = false;
  hidePasswords = { password: true, confirmation: true };
  captchaResolved = false;
  subscriptions: Subscription = new Subscription();
  selectedIndex: TosDialogStatus = TosDialogStatus.untouched;
  user$?: Observable<User | null>;

  constructor(
    private userService: UserService,
    private countryStatePickerService: CountryStateFetcherService,
    private dialog: MatDialog,
    private tosService: TosService
  ) {}

  signupForm = new FormGroup(
    {
      first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      last_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9_-]{3,15}$')],
        asyncValidators: [this.userService.usernameValidator()],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[〜!@#%..])[A-Za-z\\d〜!@#%..]{8,}$'
          ),
        ],
      }),
      confirm_password: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),
        ],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      company_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      country: new FormControl(
        { value: '', disabled: this.countriesLoading },
        { nonNullable: true, validators: [Validators.required] }
      ),
      street_address_1: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      street_address_2: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      state: new FormControl({ value: '', disabled: this.statesLoading }, { nonNullable: true }),
      zip: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9- ]+$')],
      }),
    },
    { validators: confirmPasswordValidator('password', 'confirm_password') }
  );

  get firstName() {
    return this.signupForm.get('first_name');
  }

  get lastName() {
    return this.signupForm.get('last_name');
  }

  get username() {
    return this.signupForm.get('username');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirm_password');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get companyName() {
    return this.signupForm.get('company_name');
  }

  get streetAddress() {
    return this.signupForm.get('street_address_1');
  }

  get city() {
    return this.signupForm.get('city');
  }

  get state() {
    return this.signupForm.get('state');
  }

  get zip() {
    return this.signupForm.get('zip');
  }

  ngOnInit(): void {
    this.countriesLoading = true;

    this.subscriptions.add(
      this.countryStatePickerService.getCountries().subscribe(countries => {
        this.countries = countries;
        this.countriesLoading = false;
      })
    );

    this.user$ = this.userService.user$;
  }

  togglePasswordsHiding(field: 'password' | 'confirmation') {
    switch (field) {
      case 'password':
        this.hidePasswords.password = !this.hidePasswords.password;
        break;
      case 'confirmation':
        this.hidePasswords.confirmation = !this.hidePasswords.confirmation;
        break;
    }
  }

  addPlus(): void {
    const phoneValue = this.phone?.value;
    if (phoneValue === '') {
      this.signupForm.patchValue({ phone: '+' });
    }
  }

  hidePlus(): void {
    let phoneValue = this.phone?.value;
    if (phoneValue?.includes('+') && phoneValue?.length === 1) {
      phoneValue = '';
      this.signupForm.patchValue({ phone: phoneValue });
    }
  }

  enterNumbersOnly($event: KeyboardEvent): void {
    const key = $event.key;
    const isNumbersToRemove = this.phone?.value && this.phone.value.length > 1;
    if (
      (key === 'Backspace' && isNumbersToRemove) ||
      (key === 'Delete' && isNumbersToRemove) ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Tab' ||
      key === 'Escape' ||
      (key === 'c' && 'Control') ||
      (key === 'v' && 'Control')
    ) {
      return;
    }
    if (!/^[0-9]$/.test(key)) {
      $event.preventDefault();
    }
  }

  inputHandler($event: Event): void {
    const inputValue = ($event.currentTarget as HTMLInputElement).value;
    if (!inputValue.startsWith('+')) {
      this.phone?.setValue(`+${inputValue}`);
      return;
    } else if (inputValue.startsWith('+') && !/^\+\d+$/.test(inputValue)) {
      const newValue = inputValue.replace(/(?<!^)\+/g, '').replace(/[^\d+]/g, '');
      this.phone?.setValue(newValue);
    }
  }

  getStates($event: MatSelectChange): void {
    const selectedCountry = $event.value;
    this.statesLoading = true;
    this.subscriptions.add(
      this.countryStatePickerService.getStates(selectedCountry).subscribe(states => {
        if (states.length > 0) {
          this.states = [
            {
              name: '',
              iso_3166_2: '',
              iso_3166_1_a2: '',
              i_country_subdivision: 0,
            },
            ...states,
          ];
          this.state?.disabled && this.state?.enable();
        } else if (states.length === 0) {
          this.state?.reset();
          this.state?.enabled && this.state?.disable();
        }
        this.statesLoading = false;
      })
    );
  }

  resolved(captchaResponse: string): void {
    this.captchaResolved = !!(captchaResponse && captchaResponse.length > 0);
  }

  onSubmit() {
    const signupFormData = this.signupForm.value;

    const tosData: TosRequestData = {
      first_name: signupFormData.first_name ?? '',
      last_name: signupFormData.last_name ?? '',
      email: signupFormData.email ?? '',
      company: signupFormData.company_name ?? '',
      country: this.countries?.find(c => c.iso_3166_1_a2 === signupFormData.country)?.name ?? '',
      state: signupFormData.state ?? '',
      street_address: signupFormData.street_address_1 ?? '',
      city: signupFormData.city ?? '',
      postal_code: signupFormData.zip ?? '',
    };

    if (!this.tosIsLoading) {
      this.tosIsLoading = true;
      this.subscriptions.add(
        this.tosService.getTos(tosData).subscribe(
          tosURL => {
            this.openTosDialog(tosURL);
            this.tosIsLoading = false;
          },
          error => {
            this.tosIsLoading = false;
            console.error(error);
          }
        )
      );
    }
  }

  openTosDialog(tosURL: { url: string }) {
    const tosDialogRef = this.dialog.open(TosDialogComponent, {
      data: tosURL,
      disableClose: true,
    });

    this.subscriptions.add(
      tosDialogRef.afterOpened().subscribe(() => {
        this.selectedIndex = TosDialogStatus.opened;
      })
    );

    this.subscriptions.add(
      tosDialogRef.afterClosed().subscribe(isSigned => {
        if (isSigned) {
          const { confirm_password, ...restSignupFormData } = { ...this.signupForm.getRawValue() };
          this.userService.createUser(restSignupFormData);
          this.selectedIndex = TosDialogStatus.signed;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
