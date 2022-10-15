import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  url: any;

  constructor(public http: HttpClient) {
    this.url=environment.blockchainUrl;
  }

  saveMerchant(input) {
    let path = this.url + "merchants";
    console.log("saveMerchant Service Input",input);
    return this.http.post(path, input);
  }

  deleteMerchant(panNumber,bankId) {
    let path = this.url + "merchants/"+panNumber+'/'+bankId;
    return this.http.delete(path);
  }



  verifyPanCard(panNumber) {
    let path = this.url + "pan-cards/"+panNumber;
    return this.http.get(path);
  }

  verifyDL(DLNumber) {
    let path = this.url + "driving-licences/"+DLNumber;
    return this.http.get(path);
  }

  verifyAadharCard(aadharNumber,otp) {
    let path = this.url + "aadhar-cards/"+aadharNumber+"?otp="+otp;
    return this.http.get(path);
  }

  submitKycData(input) {
    let path = this.url + "merchants/"+input.merchantDetails.panNumber;
    console.log("submitKycData Service Input",input);
    return this.http.put(path, input);
  }
  getAllKycData(){
    let path = this.url + "merchants";
    return this.http.get(path);
  }

  getAllMerchants()
  {
    let path = this.url + "organizations";
    return this.http.get(path);
  }
  getSingleMerchant(panNumber)
  {
    let path = this.url + "merchants/"+panNumber;
    return this.http.get(path);
  }
  getAllAcquirerBanks()
  {
    let path = this.url + "organizations";
    return this.http.get(path);
  }
}
