import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxErrorMsgDirective, provideNgxErrorMsg, withMappings } from 'ngx-error-msg';

@Component({
    selector: 'app-template-driven-form',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, NgxErrorMsgDirective],
    providers: [
        provideNgxErrorMsg(
            withMappings({
                required: 'This field is required.',
                minlength: error => `Minimum length is ${error.requiredLength}.`,
                email: 'Invalid email.',
            }),
        ),
    ],
    template: `
        <div>
            <mat-form-field appearance="fill">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="name" required minlength="5" #nameControl="ngModel" />
                <mat-error *ngxErrorMsg="nameControl.errors; let mappedErrors">
                    {{ mappedErrors.message }}
                </mat-error>
            </mat-form-field>
        </div>

        <div>
            <mat-form-field appearance="fill">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="email" type="email" email #emailControl="ngModel" />
                <mat-error *ngxErrorMsg="emailControl.errors; let mappedErrors">
                    {{ mappedErrors.message }}
                </mat-error>
            </mat-form-field>
        </div>
    `,
    styles: [],
})
export class TemplateDrivenFormComponent {
    name = '';
    email = '';
}
