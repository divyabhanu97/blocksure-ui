import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BlockchainService } from "src/app/shared/services/blockchain/blockchain.service";
// import { stat } from "fs";
import * as echarts from "src/assets/vendor/echarts/echarts.min.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router,private blockchainService: BlockchainService) {}

  merchantlist;
  length:Number;
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
    this.blockchainService.getAllKycData().subscribe(data=>{
      console.log(data["data"]["response"]["result"])
      this.merchantlist=data["data"]["response"]["result"]
      console.log(this.merchantlist.length)
      this.length=Number(this.merchantlist.length)
      this.renderChart();
    })
    // call this functions after data is fetched from API
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
    
    this.merchantlist.forEach((insured: any) => {
      if(insured.verificationStatus.vkyc == 'Completed')
      {
        map['Approved'] = map['Approved'] + 1;
      }
      else if(insured.verificationStatus.vkyc == 'Failed')
      {
        map['Rejected'] = map['Rejected'] + 1;
      }
      else
      {
      map[insured.verificationStatus.vkyc] = map[insured.verificationStatus.vkyc] + 1;
      }
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
