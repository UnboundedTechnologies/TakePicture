import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member";
import {ImageUrlService} from "../services/image-url.service";

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent {
  @Input() member?: Member;

  public finalUrl: string | undefined;

  constructor(private http: HttpClient, private imageUrlService: ImageUrlService) {
    this.finalUrl = this.imageUrlService.imageUrlExport;
    console.log('FINAL URL', this.finalUrl);
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
}
