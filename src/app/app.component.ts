import {Component, OnDestroy} from '@angular/core';
import {WebsocketService} from "./services/websocket.service";
import {Message} from "./services/Message";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  public message: string = "Hey Server!";
  public url: string = "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self";
  public messages: Message[] = [];
  private $messages: Subscription;

  constructor(public websocketService: WebsocketService) {
    this.$messages = websocketService.observable.subscribe(_messages => {
      this.messages = _messages;
    });
  }

  ngOnDestroy(): void {
    this.websocketService.close();
    this.$messages.unsubscribe();
  }
}
