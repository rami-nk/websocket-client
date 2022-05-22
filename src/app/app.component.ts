import {AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {WebsocketService} from "./services/websocket.service";
import {Message} from "./services/Message";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, OnDestroy {

  @ViewChild("scrollable")
  private scrollable: ElementRef | undefined;

  private $messages: Subscription;
  public message: string = "Hey Server!";
  public url: string = "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";
  public messages: Message[] = [];

  constructor(public websocketService: WebsocketService) {
    this.$messages = websocketService.observable.subscribe(_messages => {
      this.messages = _messages;
    });
  }

  ngOnDestroy(): void {
    this.websocketService.close();
    this.$messages.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollable!.nativeElement.scrollTop = this.scrollable!.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
