import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validator, Validators} from "@angular/forms";
import {IDatePickerConfig} from "ng2-date-picker";
import {MemberService} from "../services/member.service";
import {Member} from "../models/member";
import {Subscription} from "rxjs";
import {CookieService} from 'ngx-cookie-service';
import {FlatpickrOptions} from 'ng2-flatpickr';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit, OnDestroy {
  @Input() imageName;

  showMemberDetails: Boolean = false;
  savedMember!: Member;
  newMember!: Member;

  createMember!: FormGroup;
  datePickerConfig: IDatePickerConfig = { showMultipleYearsNavigation: true };
  sub: Subscription | undefined;

  startConfig: FlatpickrOptions = {
    clickOpens: true,
    theme: 'dark',
    allowInput: true
  };

  onSubmit() {
    const dobControl = this.createMember.controls['dob'];
    if (dobControl.invalid && (dobControl.dirty || dobControl.touched)) {
      const dobErrorDiv = document.querySelector('.invalid-dob');
      dobErrorDiv?.classList.remove('hidden');
    } else {
      // add smth here when form is valid
    }
  }


  constructor(private fb: FormBuilder, private memberService: MemberService, private cookieService: CookieService) {}

  ngOnInit(): void{
    this.createMember =  this.fb.group({
      firstName: ['', Validators.required],
      name: ['', Validators.required],
      dateOfSubscription: [null, Validators.required],
      dob: [null, Validators.required],
      imageName: this.imageName,
      address: this.fb.group({
        street: ['', Validators.required],
        streetComplement: [''],
        zip: ['', Validators.required],
        city: ['', Validators.required]
      })
    });
  }

  create() {
    if (this.createMember.valid) {
      let member: Member = this.createMember.value;
      const dob = new Date(member.dob);
      dob.setDate(dob.getDate() + 1);

      const dateOfSubscription = new Date(member.dateOfSubscription);
      dateOfSubscription.setDate(dateOfSubscription.getDate() + 1);

      member = {...this.createMember.value, dob, dateOfSubscription};

      this.sub = this.memberService.createMember(member).subscribe({
        next: (data: Member) => {
          this.showMemberDetails = true;

          this.savedMember = data;

          this.cookieService.set('savedMember', JSON.stringify(this.savedMember), { secure: true });

          let cookieValue = this.cookieService.get('savedMember');
          let response = JSON.parse(cookieValue);

          let id = response.data.id;
          let name = response.data.attributes.name;
          let firstName = response.data.attributes.firstName;
          let dob = response.data.attributes.dob;
          let dateOfSubscription = response.data.attributes.dateOfSubscription;

          this.newMember = {
            id: id,
            imageName: member.imageName,
            name: name,
            firstName: firstName,
            dob: new Date(dob),
            dateOfSubscription: new Date(dateOfSubscription),
            address: member.address
          };
        },
        error: (err) => {
          console.error('MemberForm => POST => err', err);
        },
        complete: () => {
          console.log('completed');
        }
      });
    } else {
      console.log('Invalid form.');
    }
  }

  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}
