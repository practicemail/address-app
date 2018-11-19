import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClient, HttpParams, HttpHeaders, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FriendService } from '../../shared/services/friend.service';
import { Friend } from '../../shared/models/friend';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html'
})

export class AddFriendComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  friendform: FormGroup;
  name: FormControl;
  address: FormControl;
  country: FormControl;
  phone: FormControl;
  avatar: FormControl;
  avatarImage: File;
  //uploadImage: File;
  hasImgError: boolean;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
      public bsModalRef: BsModalRef,
      private friendService: FriendService,
      private router: Router,
      private httpClient: HttpClient,
    ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]),
    this.address = new FormControl('', Validators.required),
    this.country = new FormControl('', Validators.required),
    this.phone = new FormControl('', Validators.required),
    this.avatar = new FormControl('', []);}

  createForm() {
    this.friendform = new FormGroup({
      name: this.name,
      address: this.address,
      country: this.country,
      phone: this.phone,
      avatar: this.avatar
    });
  }

  onSubmit() {
    const image = this.fileInput.nativeElement;

    if(image.files && image.files[0]) {
      this.avatarImage = image.files[0];
      this.friendform.value.avatar = this.avatarImage;
    }

    if (this.friendform.valid) {
      let headers = new HttpHeaders();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let formData = new FormData();
      formData.append('name', this.friendform.value.name);
      formData.append('address', this.friendform.value.address);
      formData.append('country', this.friendform.value.country);
      formData.append('phone', this.friendform.value.phone);
      formData.append('avatar', this.friendform.value.avatar);

      this.friendService.createFriend(formData).subscribe(
         data => {
          this.router.navigate(['']);
          this.friendform.reset();
          //  console.log('Form Submitted!');

           return true;
         },
         error => {
           console.error('Error adding new friend!' + error);
           this.hasImgError = true;
           return false;
         }
      );
    } else {
      console.log('Form is not submitted!');
    }
  }
}


// Some old code for upload testing
//onFileSelected(event) {
//  if(event.target.files.length > 0) {
//    this.uploadImage = <File>event.target.files[0];
//  }
//}
//
//onUpload() {
//  if(this.uploadImage) {
//    this.friendService.uploadFile(this.uploadImage)
//      .subscribe(
//        data => {
//          return true;
//        },
//        error => {
//          console.error('Error for image upload ' + error);
//          return false;
//        })
//  }
//}
