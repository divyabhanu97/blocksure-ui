import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  errorMessage: string = "";
  email: string = "";
  password: string = "";

  constructor(private router: Router) {}

  ngOnInit() {}

  login() {
    if (
      "john.doe@care4u.com".toUpperCase() == this.email.toUpperCase() &&
      this.password == "Abc@1234"
    ) {
      this.errorMessage = "";
      this.router.navigateByUrl("/dashboard");
    } else {
      this.errorMessage = "Invalid Credentials";
    }
  }
}
