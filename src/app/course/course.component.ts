import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { Observable, combineLatest } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { map, startWith, tap } from 'rxjs/operators';


// Single data Observable Pattern
/*
 Declared here because we only want to use 
 this object in this class.
*/
interface CourseData {
  course: Course,
  lessons: Lesson[]
}

/*
 On push change detection means the component will only re-render if
 a change is detected.
*/
@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  // Old observables, originally used individually
  /*
  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;
  */

  // Combined data pattern
  data$: Observable<CourseData>;

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    const course$ = this.coursesService.loadCourseById(courseId)
      .pipe(
        startWith()
      );

    const lessons$ = this.coursesService.loadAllCourseLessons(courseId)
      .pipe(
        startWith([])
      );

    /*
      By default, combineLatest() will wait for both objects to emit a first value before emitting its value.
      After that, it will act as expected. If we add the 'startWith()' function to our inital observables, that
      will cause them to emit a first value, which will allow combineLatest() to work properly.
    */
    // This combines the observables but still allows them to return indiviually
    // Whenever one obsevable emits a value, a new object is emitted
    this.data$ = combineLatest([course$, lessons$])
      .pipe(
        map(([course, lessons]) => {
          return {
            course, 
            lessons
          }
        }),
        tap(console.log)
      );
  }


}











