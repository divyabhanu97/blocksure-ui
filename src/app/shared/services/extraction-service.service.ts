import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtractionServiceService {

  url:any;

  constructor(public http: HttpClient) {
    // this.url=environment.url;
   }
   ExtractPAN(input){
    let path=environment.extractionUrl+ "/pan";
      return this.http.post(path,input);
}
ExtractAadhar(input) {
  let path=environment.extractionUrl+ "/aadhar";
    return this.http.post(path,input);
}

ExtractDL(input) {
  let path=environment.extractionUrl+ "/drivinglicence";
    return this.http.post(path,input);
}
VerifyVKYC(input)
{
  let path=environment.localurl+ "/vkyc";
  return this.http.post(path,input);
}
}
