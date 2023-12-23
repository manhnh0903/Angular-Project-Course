import { Component, ElementRef } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Channel } from 'src/app/classes/channel.class';
import { Conversation } from 'src/app/classes/conversation.class';
import { Message } from 'src/app/classes/message.class';
import { DabubbleUser } from 'src/app/classes/user.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
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

  filterdUserData: DabubbleUser[] = [];
  filterdPmsData: Message[] = [];
  filterdChannelsData: Message[] = [];

  constructor(
    private el: ElementRef,
    public userService: UserService,
    private authService: FirebaseAuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    private homeNavService: HomeNavigationService
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

  openUserDetails(user: DabubbleUser) {
    this.homeNavService.pmRecipientData = user;
    this.homeNavService.pmRecipientOverlayOpen = true;
  }

  async openChanelChat(id: string) {
    await this.firestoreService.getCurrentChannel('channels', id);
    this.firestoreService.getCurrentDate();
    this.homeNavService.setChatPath('chanel');
  }

  openPmChat(userId: string) {
    this.homeNavService.pmRecipient = userId;
    this.homeNavService.setChatPath('pm');
    this.firestoreService.subscribeToPmRecipient(userId);
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
    }) as DabubbleUser[];

    this.filterdUserData = searchResult;
  }

  searchInPms() {
    const searchResult = [];

    this.pmsData.forEach((conversation: Conversation) => {
      const matchingMessages = conversation.messages.filter(
        (message: Message) => {
          const contentMatches = message.content
            .toLocaleLowerCase()
            .includes(this.searchInput.toLowerCase());

          const userIsInConversation = this.isUserInConversation(conversation);
          return contentMatches && userIsInConversation;
        }
      );
      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });

    this.filterdPmsData = searchResult;
  }

  isUserInConversation(conversation: Conversation) {
    const userId = this.userService.user.userId;

    return conversation.userId1 === userId || conversation.userId2 === userId;
  }

  searchInChannels() {
    const searchResult = [];

    this.channelsData.forEach((channel: Channel) => {
      const matchingMessages = channel.messages.filter((message: Message) => {
        const contentMatches = message.content
          .toLocaleLowerCase()
          .includes(this.searchInput.toLowerCase());

        const userInChannel = this.isUserInChannel(channel);

        console.log(
          'user in channel:',
          userInChannel,
          'content matches:',
          contentMatches
        );

        return contentMatches && userInChannel;
      });

      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });

    this.filterdChannelsData = searchResult;
  }

  isUserInChannel(channel: Channel) {
    const userId = this.userService.user.userId;

    return !!channel.users.find((user: DabubbleUser) => userId === user.userId);
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
}
