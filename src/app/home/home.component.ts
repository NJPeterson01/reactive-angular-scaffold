import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/course.store';

  /*
    This is considered a 'Smart Component'. It has little presentation logic and more
    business logic than a 'Presentational Component'.
  */

  /*
    It is not important to make a component either fully smart or presentational. These are just
    patterns for minimizing the roles a component has, helping to prevent tight coupling
  */


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // -------- Original code --------

  /* 
    This component knows too much.
    It should not know where the data is coming from (HttpClient) nor
    how to format it for it to match what the component wants. 
    Best case scenario, a component simply displays the data it receieves.
  */

  /*

  // Mutable (Imperative Style) state variables
  beginnerCourses: Course[];
  advancedCourses: Course[];


  // Ideally, you want to have services injected here that utilize
  // observables like the HttpClient, not use them directly
  constructor(
    private http: HttpClient, 
    private dialog: MatDialog) {

  }

  ngOnInit() {

    // '/api/courses' runs against the node server since we are running with a proxy.
    // Outside of that proxy, this will not work.

    // Manually subscribing to Observable (HttpClient)
    // Doing this may lead to Callback Hell (http://callbackhell.com) [Heavily nested code]
    this.http.get('/api/courses')
      .subscribe(
        res => {

          // Extract out the results which we know are under a 'payload' variable in the JSON
          const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

          // Filter data to mutable variables
          this.beginnerCourses = courses.filter(course => course.category == "BEGINNER");
          this.advancedCourses = courses.filter(course => course.category == "ADVANCED");

        });

  }

  // This code is fine to have here. But, if the HTML code is moved, this needs to go with it
  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

  }

  */

  //-------- Refactored Code (stateless) ---------
  /* 
    In the view layer, it is ideal to have most variables as (reactive style) observables and
    not mutable vairables. They should not know where the data they receive is coming from.
  */
 /*
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  // The courses service abstracts out how the system gets the data this component requires.
  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService) {
  }

  // This method should never be called directly or contain important business logic
  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    // '$' should be appended to any variable that is an observable.
    // Returned values should always be constants
    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo)),
        catchError(err => {
          const message = "Could not load courses";
          this.messagesService.showErrors(message);
          console.log(message, err);

          // CatchError must throw an observable. 
          // Throw Error throws an observable that immediately errors out and ends
          return throwError(err);
        })
      );

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // Definition of observables
    this.beginnerCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category == "BEGINNER"))
      );

    this.advancedCourses$ = loadCourses$
      .pipe(
        map(courses => courses.filter(course => course.category == "ADVANCED"))
      );
  }
  */

  //---- Refactored Code (stateful)-----

  /*
    We are abstracting out the course filter implementation and moving it
    to the store where the service will perform error handling, loading, and messaging.
  */

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore) {
  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    // Definition of observables
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }

}




