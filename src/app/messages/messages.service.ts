import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {

    private subject = new BehaviorSubject<string[]>([]);

    // We don't want the obsevable to emit an empty value. So we will filter it out.
    errors$: Observable<string[]> = this.subject.asObservable()
        .pipe(
            filter(messages => messages && messages.length > 0)
        );

    /* 
        '...' is the spread operator which can either spread the elements of an array
        or initialize an array or object from one or more objects.
    */
    showErrors(...errors: string[]) {
        this.subject.next(errors);
    }

}