import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, Validator, Validators} from "@angular/forms";
import {IDatePickerConfig} from "ng2-date-picker";
import {MemberService} from "../services/member.service";
import {Member} from "../models/member";
import {Subscription} from "rxjs";
import {CookieService} from 'ngx-cookie-service';
import flatpickr from 'flatpickr';
import { FlatpickrOptions } from 'ng2-flatpickr';

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
      // Faites ici le traitement à effectuer lorsque le formulaire est valide.
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
    if (this.createMember.valid) { // vérifier la validité du formulaire avant de créer le membre
      let member: Member = this.createMember.value;
      const dob = new Date(member.dob);
      dob.setDate(dob.getDate() + 1);

      const dateOfSubscription = new Date(member.dateOfSubscription);
      dateOfSubscription.setDate(dateOfSubscription.getDate() + 1);

      member = {...this.createMember.value, dob, dateOfSubscription};

      console.log('APRES member', member);
      console.log('APRES ADDRESSE', member.address);

      this.sub = this.memberService.createMember(member).subscribe({
        next: (data: Member) => {
          console.log('MemberForm => POST => data', data);
          this.showMemberDetails = true;

          this.savedMember = data;
          console.log('MemberForm => POST => SAVEDMEMBER', this.savedMember);

          // Enregistrer les informations du membre dans un cookie sécurisé
          this.cookieService.set('savedMember', JSON.stringify(this.savedMember), { secure: true });

          // Console.Log() le contenu du cookie
          let cookieValue = this.cookieService.get('savedMember');
          let response = JSON.parse(cookieValue);

          let id = response.data.id;
          let imageName = response.data.imageName;
          let name = response.data.attributes.name;
          let firstName = response.data.attributes.firstName;
          let dob = response.data.attributes.dob;
          let dateOfSubscription = response.data.attributes.dateOfSubscription;

          let formattedDob = new Date(dob).toISOString().substring(0, 10);
          let formattedDateOfSubscription = new Date(dateOfSubscription).toISOString().substring(0, 10);

          this.newMember = {
            id: id,
            imageName: member.imageName,
            name: name,
            firstName: firstName,
            dob: new Date(dob),
            dateOfSubscription: new Date(dateOfSubscription),
            address: member.address
          };

          console.log('Contenu du cookie:', response);
          console.log('VALEUR id:', id);
          console.log('VALEUR imageName:', imageName);
          console.log('VALEUR name:', name);
          console.log('VALEUR firstName:', firstName);
          console.log('VALEUR dob:', dob);
          console.log('VALEUR dateOfSubscription:', dateOfSubscription);
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
