import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockchainService } from 'src/app/shared/services/blockchain/blockchain.service';
import { ExtractionServiceService } from 'src/app/shared/services/extraction-service.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material';
interface Country {
  value: string;
  viewValue: string;
}

interface Gender {
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  isLinear = false;
  //merchantFormGroup: FormGroup;
  initialFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  finalFormGroup: FormGroup;
  imageFlag = 1;
  imgFile1: string;
  imgFile2: string;
  imgFile3: string;
  url;
  format;
  merchantData: any;
  acquirerBanks: any;
  name: string = '';
  isAllstepsRequired: boolean = true;
  durationInSeconds = 5;
  stepperIndex = 0;
  showModal: boolean = false;
  confirmationConsent: boolean = true;
  merchantDetails: any;
  panResult: any;
  DLResult:any;
  aadharResult: any;
  frontbase64string;
  backbase64string;

  showPopup: boolean = false

  spinnerMessage: any;
  imagecounter=0;
  //check:boolean= true;
  checkboxForm = new FormGroup({
    consentShared: new FormControl('', [Validators.required])
  })
  selectBankForm = new FormGroup({
    bankName: new FormControl('', [Validators.required]),
    panNumber: new FormControl('', [Validators.required]),

  })
  merchantForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    // panNumber: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
  });

  merchantSuccess: boolean = false;
  isAadharVerified: boolean = false;
  isPanVerified: boolean = false;
  isVkycVerified: boolean = true;


  uploadForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    imgSrc: new FormControl('', [Validators.required])
  });

  uploadForm2 = new FormGroup({
    file: new FormControl('', [Validators.required]),
    imgSrc: new FormControl('', [Validators.required])
  });

  countries: Country[] = [
    { value: 'India', viewValue: 'India' },
    { value: 'USA', viewValue: 'USA' },
    { value: 'Germany', viewValue: 'Germany' },
  ];

  genders: Gender[] = [
    { value: 'Male' },
    { value: 'Female' },
    { value: 'Others' },
  ];


  constructor(private _formBuilder: FormBuilder,
    private extractionService: ExtractionServiceService,
    private blockchainService: BlockchainService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    // console.log(this.imageFlag, name)
    this.blockchainService.getAllAcquirerBanks().subscribe(data => {
      // console.log(data["data"]["response"])
      this.acquirerBanks = data["data"]["response"]
    })
    this.firstFormGroup = new FormGroup({
      // thirdctrl: new FormControl('', [Validators.required]),
    })
    this.secondFormGroup = new FormGroup({})
    this.thirdFormGroup = new FormGroup({
      // thirdctrl: new FormControl('', [Validators.required]),
    })
    this.copyBasicInfoFromSessionStorage();
  }

  //Store Merchant Information
  saveMerchant() {

    console.log(this.merchantForm.value)
    if (this.merchantForm.valid) {
      this.spinnerMessage = "saving user data..."
      this.spinner.show();

      console.log("Personal Form", this.merchantForm.value);
      let date = this.datePipe.transform(this.merchantForm.value['dob'], 'MM/dd/yyyy');
      console.log("date", date);


      let input = {
        bankId: this.selectBankForm.value.bankName,
        consentShared: false,
        merchantDetails: this.merchantForm.value,
        verificationStatus: {
          panCard: "Pending",
          aadhaarCard: "Pending",
          vkyc: "Pending"
        }
      }
      input.merchantDetails.dob = date;
      input.merchantDetails.panNumber = this.selectBankForm.value.panNumber
      console.log("Input", input);
      this.merchantData = input;
      this.blockchainService.saveMerchant(input).subscribe(result => {
        this.openSuccessSnackBar("Data saved successfully")
        console.log(result);
        this.merchantSuccess = true;
        this.spinner.hide();
      },
        error => {
          console.log(error);
          this.openFailureSnackBar("Failed to  save")
          this.spinner.hide();
        })
    }

  }
  setImageFlag(type: String) {
    if (type === "NEXT")
      this.imageFlag++;

    else if (type === "BACK")
      this.imageFlag--;
    console.log(this.imageFlag)
  }

  imageReset() {
    this.imageFlag = 1;
    this.merchantForm.reset();
    this.selectBankForm.reset();
    this.isPanVerified = false;
    this.isAadharVerified = false;
    this.isVkycVerified = false;
    this.stepperIndex = 0;
    this.blockchainService.deleteMerchant(this.selectBankForm.value.panNumber, this.selectBankForm.value.bankName).subscribe(result => {
      console.log("Removed Merchant", result);
    },
      error => {
        console.log("Error", error);

      })
  }

  get uf() {
    return this.uploadForm.controls;
  }

  isCorrectBankSelected: boolean = false;
  provideConsent(input) {
    this.confirmationConsent = input;
    if (input == false) {
      this.isAllstepsRequired = true;
      // this.BankSelected();
    }
    else {
      this.spinnerMessage = "sharing kyc data..."
      this.spinner.show();
      console.log(this.merchantDetails)
      this.merchantDetails.bankId = this.selectBankForm.value.bankName,
      this.isPanVerified=this.merchantDetails.verificationStatus.panCard=='Completed'?true:false;
      this.isAadharVerified=this.merchantDetails.verificationStatus.aadhaarCard=='Completed'?true:false;
      this.isVkycVerified=this.merchantDetails.verificationStatus.vkyc=='Completed'?true:false;
        this.blockchainService.saveMerchant(this.merchantDetails).subscribe(async result => {
          this.imageFlag = 4;
          console.log(result);
          await this.delay(1000);
          this.showPan = true;
          await this.delay(1000);
          this.showAadhar = true;
          await this.delay(1000);
          this.showVkyc = true;
          await this.delay(1000);
          this.showVerification = true;
          this.merchantSuccess = true;
          this.spinner.hide();
          
          this.openSuccessSnackBar("Shared and validated data sucessfully")
         
          
          
        },
          error => {
            console.log(error);
            this.openFailureSnackBar("Failed to  save")
            this.spinner.hide();
          })

    }

  }

  isBankFound = false;
  BankSelected() {
    this.isBankFound = false
    if (this.selectBankForm.valid) {
      console.log("Checking PAN Card");

      this.blockchainService.getSingleMerchant(this.selectBankForm.value.panNumber).subscribe(data => {

        console.log(data["data"]["response"].length,data["data"]["response"],)

        let index = data["data"]["response"].length - 1;
        this.merchantDetails = data["data"]["response"][index]
        if (index < 0) {
          console.log("No Data Found");
          this.isAllstepsRequired = true;
          this.isCorrectBankSelected = true;
          this.showModal = false;
        }
        //DATA EXISTS
        else {

          for (var i = 0; i <= index; i++) {
            if (data["data"]["response"][i]["bankId"] == this.selectBankForm.value.bankName &&
            data["data"]["response"][i]["verificationStatus"]["aadhaarCard"] == "Completed" &&
            data["data"]["response"][i]["verificationStatus"]["panCard"] == "Completed") {
              this.openSnackBar();
              this.stepperIndex = 0;
              // this.imageReset();
              console.log("KYC Already Completed for selected Insurer");

              this.isAllstepsRequired = true;
              this.isCorrectBankSelected = false;
              this.isBankFound = true;
            }
            else if (data["data"]["response"][i]["bankId"] == this.selectBankForm.value.bankName &&
            data["data"]["response"][i]["verificationStatus"]["aadhaarCard"] == "Pending" &&
            data["data"]["response"][i]["verificationStatus"]["panCard"] == "Pending"){
              this.merchantData=data["data"]["response"][i]

              this.stepperIndex = 2;
              // this.imageReset();
              console.log("KYC Already Completed for selected Insurer");

              this.isAllstepsRequired = true;
              this.isCorrectBankSelected = false;
              // this.isBankFound = true;

            }
          }
          // if(data["data"]["response"].length>0 && data["data"]["response"][0]["consentShared"] == true && data["data"]["response"][0]["bankId"] == this.selectBankForm.value.bankName )
          // {
          //   this.openSnackBar();
          //   this.stepperIndex=0;
          //   // this.imageReset();
          //   console.log("KYC Already Completed for selected bank");

          //   this.isAllstepsRequired = true;
          //   this.isCorrectBankSelected=false;
          // }
          // console.log(data["data"]["response"][index]["consentShared"])
          if (!this.isBankFound && data["data"]["response"].length > 0 && data["data"]["response"][index]["consentShared"] == true && data["data"]["response"][index]["bankId"] != this.selectBankForm.value.bankName) {
            // this.openSnackBar();
            console.log("KYC Initiated for selected bank");
            this.isAllstepsRequired = false;
            this.isCorrectBankSelected = true;
            this.showModal = true;
          }
          else {
            if (!this.isBankFound) {
              console.log("inside last else")
              this.isAllstepsRequired = true;
              this.showModal = false;
              this.isCorrectBankSelected = true;
            }
          }
          // console.log(this.isAllstepsRequired);


        }
      })
    }
  }
  onImage1Change(e) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      this.spinnerMessage = "extracting Driving Licence card...";
      // this.spinner.show();

      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let result = reader.result as string
        this.frontbase64string = result.substring(result.indexOf(',') + 1);
        let input = {
          "frontbase64data": this.frontbase64string,
          "backbase64data": this.backbase64string
        }
        this.imagecounter = this.imagecounter+1;
        // console.log("PAN card",base64string);
        if(this.imagecounter==2)
        {
          this.spinner.show();
          console.log("inside loop");
        this.extractionService.ExtractDL(input).subscribe(data => {
          this.spinnerMessage = "validating driving licence..."
          console.log("Driving Licence", data)
          let merchantDLData: any = data;
          this.DLResult = data;
          this.blockchainService.verifyDL(merchantDLData.Reference_Number).subscribe(result => {
            let blockchainResult: any = result;
            let governmentData = blockchainResult.data.response.result;
            console.log("Government Result", governmentData);
            if (merchantDLData.Date_Of_Birth === governmentData.dob && merchantDLData.Name === governmentData.fullName &&  merchantDLData.Validity === governmentData.validity) {
              this.isPanVerified = true;
              console.log("Driving Licence Verified Successfuly");
              this.openSuccessSnackBar("Driving Licence Verified Successfuly")
            }
            else {
              console.log("Driving Licence Verification Failed");
              this.openFailureSnackBar("Driving Licence Verification Failed")
            }
            this.spinner.hide();
          },
            error => {
              console.log("Error", error);
              console.log("Driving Licence Verification Failed");
              this.openFailureSnackBar("Driving Licence Verification Failed")
              this.spinner.hide();
            })

        },
          error => {

            console.log("Error", error);

            this.spinner.hide();

          })
        }

        

        this.imgFile1 = reader.result as string;
        this.uploadForm.patchValue({
          imgSrc: reader.result
        });

      };
    }
  }
  onImage3Change(e) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      this.spinnerMessage = "extracting Driving Licence card...";
      

      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let result = reader.result as string
        this.backbase64string = result.substring(result.indexOf(',') + 1);
        this.imgFile3= reader.result as string;
        let input = {
          "frontbase64data": this.frontbase64string,
          "backbase64data": this.backbase64string
        }
        this.imagecounter = this.imagecounter+1;
        this.uploadForm.patchValue({
          imgSrc: reader.result
        });
        if(this.imagecounter==2)
        {
          this.spinner.show();
          console.log(input);
        this.extractionService.ExtractDL(input).subscribe(data => {
          this.spinnerMessage = "validating driving licence..."
          console.log("Driving Licence", data)
          let merchantDLData: any = data;
          this.DLResult = data;
          this.blockchainService.verifyDL(merchantDLData.Reference_Number).subscribe(result => {
            let blockchainResult: any = result;
            let governmentData = blockchainResult.data.response.result;
            console.log("Government Result", governmentData);
            if (merchantDLData.Date_Of_Birth === governmentData.dob && merchantDLData.Name === governmentData.fullName &&  merchantDLData.Validity === governmentData.validity) {
              this.isPanVerified = true;
              console.log("Driving Licence Verified Successfuly");
              this.openSuccessSnackBar("Driving Licence Verified Successfuly")
            }
            else {
              console.log("Driving Licence Verification Failed");
              this.openFailureSnackBar("Driving Licence Verification Failed")
            }
            this.spinner.hide();
          },
            error => {
              console.log("Error", error);
              console.log("Driving Licence Verification Failed");
              this.openFailureSnackBar("Driving Licence Verification Failed")
              this.spinner.hide();
            })

        },
          error => {

            console.log("Error", error);

            this.spinner.hide();

          })
        }


      };
    }
  }

  onImage2Change(e) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      this.spinnerMessage = "extracting aadhar card...";
      this.spinner.show();

      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let result = reader.result as string
        let base64string = result.substring(result.indexOf(',') + 1)
        let input = {
          "base64data": base64string
        }
        this.extractionService.ExtractAadhar(input).subscribe(data => {
          console.log("AdharResult", data)
          this.aadharResult = data;
          let merchantAadharData: any = data;
          let otp = "5632"
          this.spinnerMessage = "validating aadhar card...";

          this.blockchainService.verifyAadharCard(merchantAadharData.Aadhar_Number, otp).subscribe(result => {
            let blockchainResult: any = result;
            let governmentData = blockchainResult.data.response.result;
            console.log("Government Result", governmentData);
            if (merchantAadharData.Date_Of_Birth === governmentData.dob && merchantAadharData.Name === governmentData.fullName && merchantAadharData.Date_Of_Birth === governmentData.dob && merchantAadharData.Gender === governmentData.gender) {
              this.isAadharVerified = true;
              console.log("Aadhar Card Verified Successfuly");
              this.openSuccessSnackBar("Aadhar Card Verified Successfuly")
            }
            else {
              console.log("Aadhar Card Verification Failed");
              this.openFailureSnackBar("Aadhar Card Verification Failed")
            }
            this.spinner.hide();
          },
            error => {
              console.log("Error", error);
              console.log("Aadhar Card Verification Failed");
              this.openFailureSnackBar("Aadhar Card Verification Failed")
              this.spinner.hide();
            })
        },
          error => {

            console.log("Error", error);

            this.spinner.hide();

          })
        // console.log("Adhar Card",base64string);
        this.imgFile2 = reader.result as string;
        this.uploadForm.patchValue({
          imgSrc: reader.result
        });

      };
    }
  }

  //Check if Aadhar and Pan Card are verified
  isVerified() {
    return this.isAadharVerified && this.isPanVerified ? true : false;
  }

  onSelectFile(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.spinnerMessage = "validating video...";
        this.spinner.show();
        let result = reader.result as string
        let base64string = result.substring(result.indexOf(',') + 1);
        let input = {
          "base64data": base64string
        }
        this.extractionService.VerifyVKYC(input).subscribe(data => {
          console.log(data);

          //VERIFICATION LOGIC GOES HERE
          let response: any = data;
          if (response.status == 'VERIFIED!') {
            this.isVkycVerified = true;
            this.openSuccessSnackBar("Video Verification successful")
          }
          else {
            console.log("VKYC FAILED", response.status);
            this.openFailureSnackBar("Video Verification Failed")
          }
          this.spinner.hide();
        },
          error => {
            console.log(error);
            this.spinner.hide();

          })
        // console.log("video", base64string)
        this.url = (<FileReader>event.target).result;
      }
    }
  }

  upload() {
    console.log(this.uploadForm.value);
  }

  submitKycData() {
    this.stepperIndex = this.stepperIndex + 1;
    this.imageFlag++;
    this.spinnerMessage = "analysing and verifying data..."
    this.spinner.show();
    this.merchantData.verificationStatus.panCard = this.isPanVerified ? "Completed" : "Failed";
    this.merchantData.verificationStatus.aadhaarCard = this.isAadharVerified ? "Completed" : "Failed";
    this.merchantData.verificationStatus.vkyc = this.isVkycVerified ? "Completed" : "Failed";
    this.merchantData.consentShared = this.checkboxForm.value.consentShared;

    this.blockchainService.submitKycData(this.merchantData).subscribe(async result => {
      console.log("Result", result);
      this.spinner.hide();
      await this.delay(1000);
      this.showPan = true;
      await this.delay(1000);
      this.showAadhar = true;
      await this.delay(1000);
      this.showVkyc = true;
      await this.delay(1000);
      this.showVerification = true;

    },
      error => {
        console.log("Error", error);
        this.spinner.hide();
      })
  }
  openSnackBar() {
    this._snackBar.open("Already Applied", "Please Select New Insurer", {
      duration: 3000,
      panelClass: ['red-snackbar', 'login-snackbar'],
    });

  }

  openInProgressSnackBar() {
    this._snackBar.open("KYC Initiated", "Please Verify your Identites", {
      duration: 3000,
      panelClass: ['red-snackbar', 'login-snackbar'],
    });

  }
  openSuccessSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000,
      panelClass: ['green-snackbar', 'login-snackbar'],
    });

  }
  openFailureSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000,
      panelClass: ['red-snackbar', 'login-snackbar'],
    });
  }
  // onChange() {
  //  console.log(this.checkboxForm)
  // }

  showPan: boolean = false;
  showAadhar: boolean = false;
  showVkyc: boolean = false;
  showVerification: boolean = false;

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  copyBasicInfoFromSessionStorage() {
    let item = sessionStorage.getItem('basicInfo');
    try {
      let basicInfo : any  = JSON.parse(item);
      this.merchantForm  = new FormGroup({
        name: new FormControl((basicInfo.firstName || '') + ' ' + (basicInfo.lastName || ''), [Validators.required]),
        // panNumber: new FormControl('', [Validators.required]),
        dob: new FormControl((basicInfo.dob || ''), [Validators.required]),
        country: new FormControl((basicInfo.country || ''), [Validators.required]),
        phone: new FormControl((basicInfo.phone || ''), [Validators.required]),
        address: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        postalCode: new FormControl((basicInfo.pincode || ''), [Validators.required]),
        city: new FormControl('', [Validators.required]),
      });
    } catch {
      console.error("invalid session info")
    }
  }
}
