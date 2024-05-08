import {AfterViewInit, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import { CoursesService } from '../services/courses.service';

/*
    This component is utilized like a modal. It pops up when the user wants 
    to edit a course.
*/

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;
    course: Course;

    /*
        It is a better practice to put form construction in the
        constructor and not ngOnInit.
    */
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        private courseService: CoursesService,
        @Inject(MAT_DIALOG_DATA) course:Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {

      const changes = this.form.value;

      // Manual subscription cannot always be avoided. Here, it is necessary.
      this.courseService.saveCourse(this.course.id, changes)
        .subscribe(
            (val) => {
                // Closing with value is recommended so you can determine if the modal was closed via
                // the 'close' button or by a successful save.
                this.dialogRef.close(val);
            }
        );

    }

    close() {
        this.dialogRef.close();
    }

}
