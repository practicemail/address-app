import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// for model driven form
import { ReactiveFormsModule } from '@angular/forms';
// for template driven form
import { FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { FriendsComponent } from './friends/friends.component';
import { FriendListComponent } from './friends/friend-list/friend-list.component';
import { AddFriendComponent } from './friends/friend-list/add-friend.component';
import { FriendDetailComponent } from './friends/friend-detail/friend-detail.component';
import { HeaderComponent } from './shared/header/header.component';
import { ArraySortPipe } from './common/sort.pipe';

import { FriendService } from './shared/services/friend.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {CarouselModule} from "angular2-carousel";

import { routing } from './app.routing';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    FriendListComponent,
    FriendDetailComponent,
    HeaderComponent,
    ArraySortPipe,
    FriendsComponent,
    AddFriendComponent,
    NotFoundComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    routing,
    CarouselModule
  ],
  providers: [FriendService, BsModalRef, ArraySortPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
