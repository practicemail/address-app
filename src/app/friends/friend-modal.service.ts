import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AddFriendComponent } from './add-friend-modal.component';
import { FriendDetailComponent } from './show-details-modal.component';
import { Friend } from '../shared/models/friend';


@Injectable()
export class FriendModalService {
  friend: Friend;
  bsModalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  openModalAddNewFriend(list) {
    const initialState = {
      friends: list,
    };
    this.bsModalRef = this.modalService.show(AddFriendComponent, {initialState});
  }

  openModalShowDetails(friend) {
    const initialState = {
      friend: friend,
    };
    this.bsModalRef = this.modalService.show(FriendDetailComponent, {initialState});
  }
}
