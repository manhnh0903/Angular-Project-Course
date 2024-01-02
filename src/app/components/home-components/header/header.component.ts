import { Component, ElementRef } from '@angular/core';
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
  menuOpen: boolean = false;

  searchInput: string;
  private usersData: {}[];
  private pmsData: {}[];
  private channelsData: {}[];

  public filterdUserData: DabubbleUser[] = [];
  public filterdPmsData: Message[] = [];
  public filterdChannelsData: Message[] = [];

  constructor(
    private el: ElementRef,
    public userService: UserService,
    private authService: FirebaseAuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    public homeNavService: HomeNavigationService
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

  /**
   * Opens the menu by setting the 'menuOpen' property to true.
   */
  openMenu() {
    this.menuOpen = true;
  }

  /**
   * Closes the menu by setting the 'menuOpen' property to false.
   */
  closeMenu() {
    this.menuOpen = false;
  }

  /**
   * Opens the user details overlay, displaying information about the selected user.
   * Sets the 'pmRecipientData' property in 'homeNavService' to the selected user,
   * opens the overlay, resets the search input, and clears search results.
   * @param user - The DabubbleUser for whom to display details.
   */
  openUserDetails(user: DabubbleUser) {
    this.homeNavService.pmRecipientData = user;
    this.homeNavService.pmRecipientOverlayOpen = true;
    this.searchInput = '';
    this.resetResults();
  }

  /**
   * Opens the channel chat with the specified ID.
   * Retrieves channel data, sets the chat path to 'channel',
   * resets the search input, and clears search results.
   * @param id - The ID of the channel to open.
   */
  async openChanelChat(id: string) {
    await this.firestoreService.getCurrentChannel('channels', id);
    this.firestoreService.getCurrentDate();
    this.homeNavService.setChatPath('chanel');
    this.searchInput = '';
    this.resetResults();
  }

  /**
   * Opens a private message chat with the specified user.
   * Sets the chat path to 'pm', subscribes to the PM recipient's data,
   * resets the search input, and clears search results.
   * @param userId - The ID of the user for the private message chat.
   */
  openPmChat(userId: string) {
    this.homeNavService.pmRecipient = userId;
    this.homeNavService.setChatPath('pm');
    this.firestoreService.subscribeToPmRecipient(userId);
    this.searchInput = '';
    this.resetResults();
  }

  /**
   * Subscribes to data subjects for all collections (pms, users, channels).
   * Updates local data arrays when new data is received.
   */
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

  /**
   * Initiates a search based on the current input value.
   * Resets previous search results and performs searches in Users, PMs, and Channels.
   * Requires a minimum input length of 3 characters.
   */
  searchApp() {
    this.resetResults();

    if (this.searchInput.length >= 3) {
      this.searchInUsers();
      this.searchInPms();
      this.searchInChannels();
    }
  }

  /**
   * Resets the filtered data arrays for Users, PMs, and Channels.
   * Used to clear previous search results when initiating a new search.
   */
  resetResults() {
    this.filterdUserData = [];
    this.filterdPmsData = [];
    this.filterdChannelsData = [];
  }

  /**
   * Searches for users based on the provided search input.
   * Filters users by matching their name or email (case-insensitive) with the search input.
   * Populates the filtered user data array with the search results.
   */
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

  /**
   * Searches for messages in private conversations (PMS) based on the provided search input.
   * Filters messages by matching their content (case-insensitive) with the search input.
   * Only includes messages from conversations where the logged-in user is a participant.
   * Populates the filtered private messages (PMS) data array with the search results.
   */
  searchInPms() {
    const searchResult = [];

    this.pmsData.forEach((conversation: Conversation) => {
      const matchingMessages = conversation.messages.filter(
        (message: Message) => {
          const contentMatches = this.isContentMatching(message);
          const userIsInConversation = this.isUserInConversation(conversation);
          return contentMatches && userIsInConversation;
        }
      );
      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });

    this.filterdPmsData = searchResult;
  }

  /**
   * Checks if the content of a message matches the search input.
   *
   * @param {Message} message - The message to check.
   * @returns {boolean} True if the content matches, false otherwise.
   */
  isContentMatching(message: Message) {
    return message.content
      .toLocaleLowerCase()
      .includes(this.searchInput.toLowerCase());
  }

  /**
   * Checks if the logged-in user is a participant in the provided conversation.
   * @param conversation - The conversation to check.
   * @returns True if the user is a participant, false otherwise.
   */
  isUserInConversation(conversation: Conversation) {
    const userId = this.userService.user.userId;

    return conversation.userId1 === userId || conversation.userId2 === userId;
  }

  /**
   * Searches for messages in channels based on the search input.
   * Filters messages where content matches the search input and the logged-in user is a member.
   */
  searchInChannels() {
    const searchResult = [];

    this.channelsData.forEach((channel: Channel) => {
      const matchingMessages = channel.messages.filter((message: Message) => {
        const contentMatches = this.isContentMatching(message);
        const userInChannel = this.isUserInChannel(channel);
        return contentMatches && userInChannel;
      });
      if (matchingMessages.length > 0) searchResult.push(...matchingMessages);
    });
    this.filterdChannelsData = searchResult;
  }

  /**
   * Checks if the logged-in user is a member of the provided channel.
   * @param channel - The channel to check.
   * @returns True if the user is a member, false otherwise.
   */
  isUserInChannel(channel: Channel) {
    const userId = this.userService.user.userId;

    return !!channel.users.find((user: DabubbleUser) => userId === user.userId);
  }

  /**
   * Logs the user out, navigates to the login page, updates online status, and closes the menu.
   */
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

  /**
   * Updates the user's online status to false and updates user in the Firestore service.
   */
  async updateOnlineStatus() {
    this.userService.user.onlineStatus = false;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
  }
}
