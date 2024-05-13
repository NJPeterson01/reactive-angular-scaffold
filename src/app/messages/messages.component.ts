import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessages: boolean = false;

  // Instead of subscribing to the messages service observable,
  // we can create a local variable instead to track it. This
  // extends the observable to this component.
  errors$: Observable<string[]>;

  constructor(public messageService: MessagesService) {
    console.log('Created messages component');
  }

  // The local errors$ variable will now track the messages services one.
  ngOnInit() {
    this.errors$ = this.messageService.errors$
      .pipe(
        tap(() => this.showMessages = true)
      );
  }

  onClose() {
    this.showMessages = false;
  }

}
