import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';
import { createNgxErrorMsgMapper, NgxErrorMsgDirective, provideNgxErrorMsg } from 'ngx-error-msg';

const Mapper = createNgxErrorMsgMapper(() => {
    const translateService = inject(TranslateService);

    return {
        required: () => translateService.get('ERRORS.REQUIRED'),
        minlength: (error: any) =>
            translateService.get('ERRORS.MIN_LENGTH', {
                minLength: error.requiredLength,
            }),
    };
});

@Component({
    selector: 'app-translated-messages',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, NgxErrorMsgDirective],
    providers: [provideNgxErrorMsg(Mapper)],
    template: `
        <div>
            <mat-form-field appearance="fill">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="name" required minlength="5" #nameControl="ngModel" />
                <mat-error *ngxErrorMsg="nameControl.errors; let message">{{ message }}</mat-error>
            </mat-form-field>
        </div>
    `,
    styles: [],
})
export class TranslatedMessagesComponent {
    name = '';
}
