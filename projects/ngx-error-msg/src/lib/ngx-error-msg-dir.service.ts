import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { BehaviorSubject, combineLatest, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ErrorMessageMappings, NgxErrorMsgService } from './ngx-error-msg.service';

@Injectable()
export class NgxErrorMsgDirService extends NgxErrorMsgService {
    get errorMsgMappings() {
        return this.errorMsgMappings$.value;
    }

    private readonly errorMsgMappings$ = new BehaviorSubject<ErrorMessageMappings>({});
    private readonly errors$ = new BehaviorSubject<ValidationErrors | null>(null);

    readonly errorMessage$ = combineLatest({
        errors: this.errors$,
        errorsMap: this.errorMsgMappings$,
    }).pipe(
        switchMap(({ errors }) => this.toErrorMessage(errors) ?? of(null)),
        distinctUntilChanged(),
    );

    setErrors(errors: ValidationErrors | null) {
        this.errors$.next(errors);
    }

    setErrorMsgMappings(mappings: ErrorMessageMappings) {
        this.errorMsgMappings$.next(mappings);
    }
}
