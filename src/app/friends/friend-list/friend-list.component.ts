import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FriendService } from '../../shared/services/friend.service';
import { Friend } from '../../shared/models/friend';


@Component({
  selector: 'friend-list-app',
  templateUrl: './friend-list.component.html'
})

export class FriendListComponent implements OnInit {
  friends: Friend[];
  hideFriendInfo: boolean;
  found: Friend;
  findIndex: number;
  showFriendData: Friend;
  images: [File];

  //delete friend modal
  modalRef: BsModalRef;
  removeFriendId: number;
  removeFriendAvatar: string;

  constructor (
    private friendService: FriendService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getFriends();
  }

  getFriends() {
    this.friendService.getFriends()
    .subscribe(friends => {
      return this.friends = friends;
    });
  }

  //uploadedImgs() {
  //  this.friendService.getUploadedImgs()
  //    .subscribe(data => {
  //      console.log(data);
  //      return this.images = data;
  //    });
  //}

  //onShowFriend(friend) {
  //  this.friendService.showFriendDetails(friend);
  //  this.showFriendData = friend;
  //}

  onDelete(id: number, avatar: string) {
    this.friendService.deleteFriend(id, avatar).subscribe(
        result => this.friends = this.friends.filter((friend) => friend.id !== id),
        error =>  console.error('Error adding new friend!' + error)
      );

  }

  // Remove friend modal
  openModal(template: TemplateRef<any>, id: number, avatar: string) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.removeFriendId = id;
    this.removeFriendAvatar = avatar;
  }

  confirm(): void {
    this.onDelete(this.removeFriendId, this.removeFriendAvatar);
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
}
