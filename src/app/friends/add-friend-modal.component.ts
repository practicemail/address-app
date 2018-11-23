import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FriendService } from '../shared/services/friend.service';
import { Friend } from '../shared/models/friend';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend-modal.component.html'
})

export class AddFriendComponent implements OnInit {
  friendform: FormGroup;
  name: FormControl;
  address: FormControl;
  country: FormControl;
  phone: FormControl;
  avatarImage: File;
  hasImgError: boolean;
  friends: Array<Object>;
  url: any;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public modalRef: BsModalRef,
    private friendService: FriendService
  ) {}

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  decline(): void {
    this.modalRef.hide();
  }

  createFormControls() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]),
      this.address = new FormControl('', Validators.required),
      this.country = new FormControl('', Validators.required),
      this.phone = new FormControl('', Validators.required)
  }

  createForm() {
    this.friendform = new FormGroup({
      name: this.name,
      address: this.address,
      country: this.country,
      phone: this.phone
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        //this.url = event.target.result;
        this.url = reader.result;
      }
    }
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
            this.friends.unshift(
              {
                name: data.name,
                address: data.address,
                country: data.country,
                phone: data.phone,
                avatar: this.url
              }
            );
            this.friendform.reset();
            this.decline();

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
