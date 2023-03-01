import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Member} from "../models/member";
import {Address} from "../models/address";
import { Cloudinary } from 'cloudinary-core';
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent {
  @Input() member?: Member;


  // Set the cloudinary URL
  url = "https://res.cloudinary.com/dycyhvjgs/image/upload/";
  finalUrl;


  private cloudinary = new Cloudinary({
    cloud_name: 'dycyhvjgs',
    api_key: '661114432265727',
    api_secret: 'rpZBW9PsBn_BrbLXPB69VmydBMQ',
  });

  constructor(private http: HttpClient) {
  }

  @ViewChild('card', {static: false}) card: ElementRef | undefined;
  flipped: boolean = false;

  flipCard() {
    if (!this.flipped) {
      this.card?.nativeElement.classList.add('flipped');
    } else {
      this.card?.nativeElement.classList.remove('flipped');
    }
    this.flipped = !this.flipped;
  }

  private async getLatestImageVersion(): Promise<string> {
    const apiEndpoint = `https://api.cloudinary.com/v1_1/dycyhvjgs/resources/image`;
    const params = {
      type: 'upload',
      prefix: '',
      max_results: 1,
      sort_by: 'created_at',
      direction: 'desc',
      format: 'json',
    };
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const response = await this.http.get<any>(`${apiEndpoint}?${queryString}`).toPromise();
    console.log('RESPONSE RESSOURCES: ', response.resources[0].version);
    return response.resources[0].version;
  }

  // Method to construct the final URL
  async constructFinalUrl() {
    const version = await this.getLatestImageVersion();
    this.finalUrl = `${this.url}v${version}/`;
  }

  async ngOnInit() {
   await  this.constructFinalUrl();
  }
}
