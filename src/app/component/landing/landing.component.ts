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
    { name: "Australia", code: "AU" },
    { name: "Canada", code: "CA" },
    { name: "India", code: "IN" },
    { name: "United States", code: "US" },
  ];
  basicInfo = {
    firstName: "",
    lastName: "",
    dob: "",
    country: "IN",
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.test();
  }

  test() {
    this.basicInfo = {
      firstName: "Debasis",
      lastName: "Das",
      dob: "1990-12-13",
      country: "IN",
      phone: "9830012345",
      regNo: "WB12AM1593",
      pincode: "700001",
      yearBuilt: "2012",
    };
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
    console.log('toKyc()');
    sessionStorage.setItem("basicInfo", JSON.stringify(this.basicInfo));
    this.router.navigateByUrl("/kyc");
  }
}
