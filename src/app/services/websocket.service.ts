import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Message} from "./Message";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private websocket: WebSocket | undefined;
  private subject: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  public observable: Observable<Message[]> = this.subject.asObservable();

  public connect(url: string): boolean {
    this.subject.next([]);
    try {
      this.websocket = new WebSocket(url);
      this.websocket.onerror = error => {
        this.addMessage(`Error occurred: ${error.type}: See dev tools for more information`, "error");
        this.close()
      };
      this.websocket.onclose = _ => this.addMessage(`Connection closed!`, "info");
      this.websocket.onmessage = message => this.addMessage(message.data, "info");
    } catch (e) {
      this.addMessage("Connection failed!", "error");
      return false;
    }
    this.addMessage("Connection successful!", "info");
    return true;
  }

  public send(message: string): void {
    this.websocket?.send(message);
    this.addMessage(`Sent message: ${message}`, "info");
  }

  public isConnected(): boolean {
    return this.websocket?.readyState === 1;
  }

  public isConnecting(): boolean {
    return this.websocket?.readyState === 0;
  }

  public close(): void {
    this.websocket?.close();
  }

  private addMessage(message: string, severity: Message["severity"]): void {
    this.subject.next([...this.subject.value, {content: message, severity: severity}]);
  }
}
