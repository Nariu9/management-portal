import { HttpHeaders } from '@angular/common/http';

export const getRequestAuthOptions = (
  api = ''
): { headers: HttpHeaders; withCredentials: boolean } => ({
  headers: new HttpHeaders().append(
    'Authorization',
    `Bearer ${
      api === 'admin' ? 'ded8f8488e682fdf2d123869e6c1012e' : 'e9073e950d800c5d4b34a4e03da3cfaa'
    }`
  ),
  withCredentials: true,
});
