import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { FriendService } from '../shared/services/friend.service';
import { FriendModalService } from './friend-modal.service';
import { Friend } from '../shared/models/friend';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})


export class FriendsComponent implements OnInit {
  friends:Friend[];
  images:[File];

  //delete friend modal
  modalRef:BsModalRef;
  removeFriendId:number;
  removeFriendAvatar:string;

  constructor(private friendService:FriendService,
              private friendModalService:FriendModalService,
              private modalService:BsModalService) {
  }

  ngOnInit() {
    this.getFriends();
  }

  getFriends() {
    this.friendService.getFriends()
      .subscribe(friends => {
        return this.friends = friends;
      });
  }

  // Remove friend modal
  openModal(template:TemplateRef<any>, id:number, avatar:string) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.removeFriendId = id;
    this.removeFriendAvatar = avatar;
  }

  onDelete(id:number, avatar:string) {
    this.friendService.deleteFriend(id, avatar).subscribe(
        result => this.friends = this.friends.filter((friend) => friend.id !== id),
        error =>  console.error('Removing the friend!' + error)
    );
  }

  confirm():void {
    this.onDelete(this.removeFriendId, this.removeFriendAvatar);
    this.modalRef.hide();
  }

  decline():void {
    this.modalRef.hide();
  }

  // Add a new friend modal
  onAddNewFriend() {
    this.friendModalService.openModalAddNewFriend();
  }

  //Show friend details modal
  onShowDetails(friend) {
    this.friendModalService.openModalShowDetails(friend);
  }

  // get uploaded images for dist
  //uploadedImgs() {
  //  this.friendService.getUploadedImgs()
  //    .subscribe(data => {
  //      console.log(data);
  //      return this.images = data;
  //    });
  //}
}
