import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { getRequestAuthOptions } from '../temp/get-request-auth-options';
import { PreloaderDialogService } from './preloader-dialog.service';

export interface UserRequestData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  service_password?: string;
  email: string;
  phone: string;
  company_name: string;
  country: string;
  street_address_1: string;
  street_address_2?: string;
  city: string;
  state?: string;
  zip: string;
}

export interface User {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  i_customer: number;
  is_blocked: boolean;
}

export interface LoginRequest {
  password?: string;
  login: string;
  token?: string;
}

@Injectable()
export class UserService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private dialogService: PreloaderDialogService) {}

  createUser(userInfo: UserRequestData): void {
    this.dialogService.openPreloaderDialog();
    this.http
      .post<User>(
        'https://ipaas-dev.portaone.com/api/core/v2/admin/users/',
        {
          user_info: userInfo,
          token_info: {
            hs_customer_id: '4172796754',
            rt_customer_id: '554',
            qb_project_code: '',
            qb_item_name: '',
          },
          is_blocked: false,
        },
        getRequestAuthOptions('admin')
      )
      .subscribe(
        user => {
          this.user$.next(user);
          this.login({ password: user.password, login: user.username });
          this.dialogService.closePreloaderDialog();
        },
        error => {
          this.dialogService.closePreloaderDialog();
          console.error(error);
        }
      );
  }

  login(loginData: LoginRequest): void {
    this.http.post<{ session_id: string }>(
      'https://ipaas-dev.portaone.com/api/core/v2/login',
      loginData,
      getRequestAuthOptions('')
    );
  }

  checkWhetherUsernameExists(username: string) {
    return this.http
      .get<{ username: string }>(
        `https://ipaas-dev.portaone.com/api/core/v2/admin/users/${username}`,
        getRequestAuthOptions('admin')
      )
      .pipe(
        map(res => {
          return !!res.username;
        }),
        catchError(err => throwError(err))
      );
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value)
        .pipe(
          delay(1000),
          switchMap(value =>
            this.checkWhetherUsernameExists(value).pipe(
              map(isExists => (isExists ? { usernameExists: true } : null))
            )
          ),
          catchError(async () => null)
        )
        .pipe(finalize(() => control.root.updateValueAndValidity({ onlySelf: true })));
    };
  }
}
