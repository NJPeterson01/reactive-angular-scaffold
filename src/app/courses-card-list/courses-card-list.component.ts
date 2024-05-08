import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';


/*
 This is called a 'Presentational Component'. It has minimal business logic and is focused
 more on displaying input data.
*/

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.css'
})
export class CoursesCardListComponent implements OnInit {

  // Inputs allow component to component communication through binding
  // Arrays should be instantiated as empty to prevent HTML issues
  @Input()
  courses: Course[] = [];

  // Output allows other components to receieve data back from this component
  @Output()
  private coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }
  
  ngOnInit(): void {
    
  }

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    // We are able to subscribe to the dialogRef observable to see when
    // this modal was closed.
    dialogRef.afterClosed()
      .pipe(
        // Filter out any null value
        filter(val => !!val),
        // Tap allows us to add additional side effects. In this case,
        // run a command if the filter returns a value
        tap(() => this.coursesChanged.emit())
      )
      .subscribe();

  }

}