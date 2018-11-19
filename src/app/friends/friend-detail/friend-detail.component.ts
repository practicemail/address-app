import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { FriendService } from '../../shared/services/friend.service';
import { Friend } from '../../shared/models/friend';

@Component({
  selector: 'friend-detail-app',
  templateUrl: './friend-detail.component.html'
})
export class FriendDetailComponent implements OnInit, OnDestroy {
  editFriend: boolean = false;
  successMsg: boolean = false;
   selectedFriendData: Friend;
  newSelectedData: any;
  avatarImage: File;
  _subscription;

  // $ViewChild for reseting the form and checking if it's valid
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('f') form: any;

  constructor(private friendService: FriendService) {
    this._subscription = friendService.showDetails.subscribe((value) => {
      this.selectedFriendData = value;
      this.newSelectedData =  JSON.parse(JSON.stringify(this.selectedFriendData));
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this._subscription.unsubscribe();
  }

  onEditFriend() {
    this.editFriend = true;
  }

  selectedItem(eventData: Friend) {
    this.editFriend = false;
  }

  //onGoBack() {
  //  this.editFriend = false;
  //  this.newSelectedData =this.selectedFriendData;
  //}

  onSubmit() {
    const image = this.fileInput.nativeElement;

    if(image.files && image.files[0]) {
      this.avatarImage = image.files[0];
      this.form.value.avatar = this.avatarImage;
      this.form.value.oldAvatar = this.selectedFriendData.avatar ? this.selectedFriendData.avatar: '';
    }

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
      this.friendService.updateFriend(formData, this.newSelectedData.id).subscribe(
        data => {
          //  console.log('Form Submitted!', this.form.value);
          this.editFriend = false;
          this.successMsg = true;
          //this.friendService.showDetails = this.newSelectedData;

          setTimeout(function() {
            this.successMsg = false;
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

  onClose() {
    this.selectedFriendData = null;
  }
}
