import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Channel } from 'src/app/classes/channel.class';
import { Conversation } from 'src/app/classes/conversation.class';
import { Message } from 'src/app/classes/message.class';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  menuOpen = false;

  searchInput: string;
  usersData: {}[];
  pmsData: {}[];
  channelsData: {}[];

  filterdUserData: {}[];
  filterdPmsData: {}[];
  filterdChannelsData: {}[];

  constructor(
    private el: ElementRef,
    public userService: UserService,
    private authService: FirebaseAuthService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.authService.checkAuth();
    this.subAllCollections();
  }

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('menuProfileContainer')) {
        this.closeMenu();
      }
    });
  }

  openMenu() {
    this.menuOpen = true;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  subAllCollections() {
    this.firestoreService.pmsCollectionDataSubject.subscribe((data) => {
      if (data) this.pmsData = data;
    });
    this.firestoreService.usersCollectionDataSubject.subscribe((data) => {
      if (data) this.usersData = data;
    });
    this.firestoreService.channelsCollectionDataSubject.subscribe((data) => {
      if (data) this.channelsData = data;
    });
  }

  searchApp() {
    this.resetResults();

    if (this.searchInput.length >= 3) {
      console.log(this.searchInput);

      this.searchInUsers();
      this.searchInPms();
      this.searchInChannels();
    }
  }

  resetResults() {
    this.filterdUserData = [];
    this.filterdPmsData = [];
    this.filterdChannelsData = [];
  }

  searchInUsers() {
    const searchResult = this.usersData.filter((user: DabubbleUser) => {
      return (
        user.name
          .toLocaleLowerCase()
          .includes(this.searchInput.toLocaleLowerCase()) ||
        user.email
          .toLocaleLowerCase()
          .includes(this.searchInput.toLocaleLowerCase())
      );
    });

    this.filterdUserData = searchResult;
    console.log('users', this.filterdUserData);
  }

  searchInPms() {
    const searchResult = [];

    this.pmsData.forEach((conversation: Conversation) => {
      const matchingMessages = conversation.messages.filter(
        (message: Message) => {
          return message.content
            .toLocaleLowerCase()
            .includes(this.searchInput.toLocaleLowerCase());
          // ||
          // message.thread.some((threadMessage: Message) => {
          //   return threadMessage.content
          //     .toLocaleLowerCase()
          //     .includes(this.searchInput.toLocaleLowerCase());
          // })
        }
      );
      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });

    this.filterdPmsData = searchResult;
    console.log('pms', this.filterdPmsData);
  }

  searchInChannels() {
    const searchResult = [];

    this.channelsData.forEach((channel: Channel) => {
      const matchingMessages = channel.messages.filter((message: Message) => {
        return message.content
          .toLocaleLowerCase()
          .includes(this.searchInput.toLocaleLowerCase());

        // ||
        // // Check Thread of message
        // message.thread.some((threadMessage: Message) => {
        //   return threadMessage.content
        //     .toLocaleLowerCase()
        //     .includes(this.searchInput.toLocaleLowerCase());
        // })
      });

      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });

    this.filterdChannelsData = searchResult;
    console.log('channels', this.filterdChannelsData);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      await this.updateOnlineStatus();
      this.closeMenu();
    } catch (err) {
      console.error(err);
    }
  }

  async updateOnlineStatus() {
    this.userService.user.onlineStatus = false;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
  }


  searchChannels() {
    this.firestoreService.channels.forEach(channel => {
      if (channel.name.toLowerCase().includes(this.searchInput)) {
      console.log(   channel);
      
   
      }
    })
  }
}
