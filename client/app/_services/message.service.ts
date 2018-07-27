import { Injectable } from '@angular/core';
import { methods } from '../_helpers/character-methods';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages: string[] = [];

  add(message: string): void {
    message = methods.getDateString() + ' :: ' + message;
    this.messages.unshift(message);
  }

}