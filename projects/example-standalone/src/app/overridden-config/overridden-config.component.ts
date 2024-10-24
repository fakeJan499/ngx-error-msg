import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { createNgxErrorMsgMapper, NgxErrorMsgDirective, provideNgxErrorMsg } from 'ngx-error-msg';
import { ErrorMessageMappings } from 'projects/ngx-error-msg/src/public-api';

@Component({
    selector: 'app-overridden-config',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgxErrorMsgDirective],
    providers: [
        provideNgxErrorMsg(
            createNgxErrorMsgMapper({
                required: 'This field is required.',
                minlength: (error: any) => `Minimum length is ${error.requiredLength}.`,
                pattern: 'Value not matching the pattern.',
            }),
        ),
    ],
    template: `
        <div>
            <mat-form-field appearance="fill">
                <mat-label>City</mat-label>
                <input matInput [formControl]="form.controls.city" />
                <mat-error *ngxErrorMsg="form.controls.city.errors; let message">
                    {{ message }}
                </mat-error>
            </mat-form-field>
        </div>

        <div>
            <mat-form-field appearance="fill">
                <mat-label>Country</mat-label>
                <input matInput [formControl]="form.controls.country" />
                <mat-error
                    *ngxErrorMsg="
                        form.controls.country.errors;
                        config: { errorsLimit: -1 };
                        mappings: countryErrorMsgMappings;
                        let message
                    ">
                    {{ message }}
                </mat-error>
            </mat-form-field>
        </div>

        <div>
            <mat-form-field appearance="fill">
                <mat-label>Street</mat-label>
                <input matInput [formControl]="form.controls.street" />
                <mat-error
                    *ngxErrorMsg="
                        form.controls.street.errors;
                        mappings: { required: 'Street is required.' };
                        let message
                    ">
                    {{ message }}
                </mat-error>
            </mat-form-field>
        </div>

        <div>
            <mat-form-field appearance="fill">
                <mat-label>Zip Code</mat-label>
                <input matInput [formControl]="form.controls.zip" />
                <mat-error
                    *ngxErrorMsg="
                        form.controls.zip.errors;
                        mappings: { pattern: 'Use Polish zip code in format xx-xxx.' };
                        let message
                    ">
                    {{ message }}
                </mat-error>
            </mat-form-field>
        </div>
    `,
    styles: [],
})
export class OverriddenConfigComponent {
    private readonly fb = inject(FormBuilder);

    readonly form = this.fb.group({
        city: [
            '',
            [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z -]+$/)],
        ],
        country: ['', [Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
        street: ['', [Validators.required]],
        zip: ['', [Validators.pattern(/^\d\d-\d\d\d$/)]],
    });

    readonly countryErrorMsgMappings: ErrorMessageMappings = {
        minlength: error => `Country should have at least ${error.requiredLength} characters.`,
        pattern: 'Country should contain only alphabets.',
    };
}
