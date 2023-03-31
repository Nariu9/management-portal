import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRequestAuthOptions } from '../temp/get-request-auth-options';

export interface TosRequestData {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  country: string;
  state: string;
  street_address: string;
  city: string;
  postal_code: string;
}

@Injectable()
export class TosService {
  constructor(private http: HttpClient) {}

  getTos(data: TosRequestData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      'https://ipaas-dev.portaone.com/api/core/v2/tos',
      data,
      getRequestAuthOptions()
    );
  }
}
