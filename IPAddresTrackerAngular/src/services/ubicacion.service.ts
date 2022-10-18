import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(private http: HttpClient) { }

  consultarIp(ip: string): Observable<any> {
    return this.http.get(
      'https://geo.ipify.org/api/v2/country?apiKey=at_NdC700FpBmjMLI7ndjdE4eWpt2Rhu&ipAddress=' + ip).pipe(
        catchError(this.handleError)
      )
  }

  getIp(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      catchError(this.handleError)
    )
  }

  getAddressFromAddress(address: string): Observable<any> {
    let headers = new HttpHeaders({
      "X-RapidAPI-Key": "d8e84a17b8mshd07f1f44f88cf13p12eee3jsn997eb539a7b2",
      "X-RapidAPI-Host": "address-from-to-latitude-longitude.p.rapidapi.com"
    });

    return this.http.get<any>('https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=' + address, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: Response) {
    console.log(error.status);
    const msg = 'Error status code: ' + error.status + 'status message: ' + error.statusText;
    return throwError(msg)
  }
}
