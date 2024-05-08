import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";

// Public API - Courses Service

// Service layer should always return only observables to view layer

// Service is stateless for no values are being stored

// An injectable provided in root will be a singleton and
// provided to any class that calls with state maintained.
@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(
        private httpClient: HttpClient) {
    }

    // Proper reactive style returns Observables instead of raw value
    loadAllCourses(): Observable<Course[]> {
        return this.httpClient.get<Course[]>("/api/courses")
            .pipe(
                /* 
                    Map operator is an essential tool (https://rxjs.dev/api/operators/map)
                    which allows us to pass a value into a transformation function that emits
                    an observable. In this case, returning only the payload part we want.
                */
                map(res => res["payload"]),
                shareReplay()// This operator sends the results of the first call made to subsequent calls
            );
    }

    /*
        A partial means the data may be a subset of a given object. This is better is some cases
        to maintain type safety (string declaration of data types).
    */
    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // `` allows for string interpolation in Typescript
        return this.httpClient.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }

}