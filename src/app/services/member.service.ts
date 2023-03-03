import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Member } from "../models/member";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  url="https://take-picture-back-end.onrender.com/api/members";

  constructor(private http: HttpClient) { }

  createMember(member: Member) {
    const payload = { data: member };
    return this.http.post<Member>(this.url, payload);
  }
}
