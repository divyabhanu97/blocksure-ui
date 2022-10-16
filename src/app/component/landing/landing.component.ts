import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as $ from "jquery";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  basicInfoCaptured: boolean = false;
  infoType: "life" | "auto" | "home";
  countryCodes = [
    { value: "India", viewValue: "India" },
    { value: "USA", viewValue: "USA" },
    { value: "Germany", viewValue: "Germany" },
  ];
  basicInfo = {
    firstName: "",
    lastName: "",
    dob: "",
    country: "India",
    phone: "",
    regNo: "",
    pincode: "",
    yearBuilt: "",
  };

  errors = {
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    regNo: "",
    pincode: "",
    yearBuilt: "",
  };

  offers: Array<any> = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // this.test();
  }

  test() {
    this.basicInfo = {
      firstName: "Debasis",
      lastName: "Das",
      dob: "1990-12-13",
      country: "India",
      phone: "9830012345",
      regNo: "WB12AM1593",
      pincode: "700001",
      yearBuilt: "2012",
    };

    this.offers = [
      {
        insurerId: 1,
        img: "AHAM-Shield.png",
        name: "AHAM Shield",
        premium: "3,264",
      },
      {
        insurerId: 2,
        img: "HDCInsurance.png",
        name: "HDC Insurance",
        premium: "4,123",
      },
      {
        insurerId: 3,
        img: "care-for-you.png",
        name: "Care For You",
        premium: "4,338",
      },
      {
        insurerId: 4,
        img: "auto-care-x.png",
        name: "Auto Care X",
        premium: "4,791",
      },
      {
        insurerId: 5,
        img: "VitaSecure.png",
        name: "Vita Secure",
        premium: "5,264",
      },
    ];
  }

  setInfoType(type: "life" | "auto" | "home") {
    this.infoType = type;
  }

  saveBasicInfo() {
    this.validate();
    this.basicInfoCaptured = true;
  }

  /**
   * basic html validation not working due to vendor added scripts
   */
  validate() {
    this.errors = {
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      regNo: "",
      pincode: "",
      yearBuilt: "",
    };

    let errors = {
      firstName: !this.basicInfo.firstName ? "This field is required" : "",
      lastName: !this.basicInfo.lastName ? "This field is required" : "",
      dob:
        !this.basicInfo.lastName && this.infoType == "life"
          ? "This field is required"
          : "",
      phone: !this.basicInfo.phone ? "This field is required" : "",
      regNo:
        !this.basicInfo.regNo && this.infoType == "auto"
          ? "This field is required"
          : "",
      pincode:
        !this.basicInfo.pincode && this.infoType == "home"
          ? "This field is required"
          : "",
      yearBuilt:
        !this.basicInfo.yearBuilt && this.infoType == "home"
          ? "This field is required"
          : "",
    };

    if (JSON.stringify(this.errors) == JSON.stringify(errors)) {
      $("#closeModal").trigger("click");
      setTimeout(() => {
        $("#closeModal").trigger("click");
      }, 100);
      this.errors = {
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        regNo: "",
        pincode: "",
        yearBuilt: "",
      };
      setTimeout(() => {
        $("#termLife").get(0).scrollIntoView();
      }, 1000);
    } else {
      this.errors = errors;
    }
  }

  toKyc() {
    sessionStorage.setItem("basicInfo", JSON.stringify(this.basicInfo));
    this.router.navigateByUrl("/kyc");
  }
}
