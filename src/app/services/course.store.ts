import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";


/*
    A store is a stateful service designed to hold data for the application.
    This type of store will only hold data for the duration of the session.
*/
@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private messagesService: MessagesService,
    ) {
        this.loadAllCourses();
    }

    /*
        This is an optimistic data approach. It saves directly in memory first, then
        makes the call to the backend to save it properly without the user knowing. 
        This method reduces loading on the UI, improving UX, but can cause issues if 
        the data on the backend doesn't match up.
    */
    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // Gets last value emitted
        const courses = this.subject.getValue();

        const index = courses.findIndex(course => course.id == courseId);

        // New course object (spread operator adds in any data that matches existing fields)
        const newCourse: Course = {
            ...courses[index],// Populate with original course values
            ...changes // Populate with changed data from partial
        };

        // Slicing at '0' gives a 1 to 1 copy as a new instance
        const newCourses: Course[] = courses.slice(0);

        // Update course from our new object with applied changes
        newCourses[index] = newCourse;

        this.subject.next(newCourses);

        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "Could not save course";
                    console.log(message, err);
                    this.messagesService.showErrors(message);
                    return throwError(err);
                }),
                shareReplay()
            );
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses =>
                    courses.filter(course => course.category == category)
                        .sort(sortCoursesBySeqNo)
                )
            )
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response["payload"]),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messagesService.showErrors(message);
                    console.log(message, err);
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            );

        this.loadingService.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

}