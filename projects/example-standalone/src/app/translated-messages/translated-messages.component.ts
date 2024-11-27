import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';
import { NgxErrorMsgDirective, provideNgxErrorMsg, withMappings } from 'ngx-error-msg';

@Component({
    selector: 'app-translated-messages',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, NgxErrorMsgDirective],
    providers: [
        provideNgxErrorMsg(
            withMappings(() => {
                const translateService = inject(TranslateService);

                return {
                    required: () => translateService.get('ERRORS.REQUIRED'),
                    minlength: error =>
                        translateService.get('ERRORS.MIN_LENGTH', {
                            minLength: error.requiredLength,
                        }),
                };
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
    `,
    styles: [],
})
export class TranslatedMessagesComponent {
    name = '';
}
