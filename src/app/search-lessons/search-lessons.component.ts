import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css']
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]>;

  activeLesson: Lesson;

  constructor(private coursesService: CoursesService) {
  }

  ngOnInit() {

  }

  onSearch(search: string): void {
    this.searchResults$ = this.coursesService.searchLessons(search);
  }

  openLesson(lesson: Lesson): void{
    this.activeLesson = lesson;
  }

  onBackToSearch(): void {
    this.activeLesson = null;
  }

}











