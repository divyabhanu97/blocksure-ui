import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { stat } from "fs";
import * as echarts from "src/assets/vendor/echarts/echarts.min.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  insureds: Array<any> = [
    {
      firstName: "Debasis",
      lastName: "Das",
      dob: "10/17/1990",
      city: "Howrah",
      pincode: "711104",
      status: "Approved",
      pan: "ABCDE1234F",
      consent: true,
    },
    {
      firstName: "Arnab",
      lastName: "Sutar",
      dob: "10/17/1990",
      city: "Barrackpore",
      pincode: "711104",
      status: "Rejected",
      pan: "ABCDE1234F",
      consent: true,
    },
    {
      firstName: "Piyush",
      lastName: "Tiwari",
      dob: "10/17/1990",
      city: "Shyamnagar",
      pincode: "723145",
      status: "Pending",
      pan: "ABCDE1234F",
      consent: true,
    },
    {
      firstName: "Debasis",
      lastName: "Das",
      dob: "10/17/1990",
      city: "Howrah",
      pincode: "711104",
      status: "Approved",
      pan: "ABCDE1234F",
      consent: true,
    },
    {
      firstName: "Arnab",
      lastName: "Sutar",
      dob: "10/17/1990",
      city: "Barrackpore",
      pincode: "711104",
      status: "Approved",
      pan: "ABCDE1234F",
      consent: true,
    },
    {
      firstName: "Piyush",
      lastName: "Tiwari",
      dob: "10/17/1990",
      city: "Shyamnagar",
      pincode: "723145",
      status: "Pending",
      pan: "ABCDE1234F",
      consent: true,
    },
  ];

  ngOnInit() {
    // call this functions after data is fetched from API
    this.renderChart();
  }

  logout() {
    this.router.navigateByUrl("admin");
  }

  renderChart() {
    let map: any = {
      Approved: 0,
      Pending: 0,
      Rejected: 0,
    };
    let stats = [];

    this.insureds.forEach((insured: any) => {
      map[insured.status] = map[insured.status] + 1;
    });

    Object.keys(map).forEach((key) => {
      stats.push({
        value: map[key],
        name: key,
      });
    });

    echarts.init(document.querySelector("#trafficChart")).setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      color:['#70E917','#FBE600','#FF3232'],
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "left",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: stats,
        },
      ],
    });
  }
}
