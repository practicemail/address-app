import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FriendService } from '../shared/services/friend.service';
import { Friend } from '../shared/models/friend';

@Component({
  selector: 'friend-detail-app',
  templateUrl: './show-details-modal.component.html'
})

export class FriendDetailComponent implements OnInit {
  editFriend: boolean = false;
  successMsg: boolean = false;
  avatarImage: File;
  _subscription;
  friend: Friend;

  // $ViewChild for reseting the form and checking if it's valid
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('f') form: any;

  constructor(private friendService: FriendService,
              public modalRef: BsModalRef) {}

  ngOnInit() {}

  decline(): void {
    this.modalRef.hide();
  }

  onEditFriend() {
    this.editFriend = true;
  }

  selectedItem(eventData: Friend) {
    this.editFriend = false;
  }

  onGoBack() {
    this.editFriend = false;
  }

  onSubmit() {
    const image = this.fileInput.nativeElement;

    if(image.files && image.files[0]) {
      this.avatarImage = image.files[0];
      this.form.value.avatar = this.avatarImage;
    }

    this.form.value.oldAvatar = this.friend.avatar ? this.friend.avatar : '';

    let headers = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    let formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('address', this.form.value.address);
    formData.append('country', this.form.value.country);
    formData.append('phone', this.form.value.phone);
    formData.append('avatar', this.form.value.avatar);
    formData.append('oldAvatar', this.form.value.oldAvatar);

    if (this.form.valid) {
      this.friendService.updateFriend(formData, this.friend.id).subscribe(
          data => {
          this.editFriend = false;
          this.successMsg = true;

          setTimeout(function() {
            this.successMsg = false;
            this.decline();
          }.bind(this), 2000);

          return true;
        },
          error => {
          console.error('Error adding new friend!' + error);
          return false;
        }
      );
    }
  }
}
