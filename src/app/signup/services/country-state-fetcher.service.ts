import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRequestAuthOptions } from '../temp/get-request-auth-options';

export interface Country {
  iso_3166_1_a2: string;
  name: string;
}

export interface State {
  i_country_subdivision: number;
  iso_3166_1_a2: string;
  iso_3166_2: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryStateFetcherService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(
      'https://ipaas-dev.portaone.com/api/core/v2/countries',
      getRequestAuthOptions()
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.http.get<State[]>(
      `https://ipaas-dev.portaone.com/api/core/v2/countries/${countryCode}/states`,
      getRequestAuthOptions()
    );
  }
}
