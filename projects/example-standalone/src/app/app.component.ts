import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OverriddenConfigComponent } from './overridden-config/overridden-config.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { TranslatedMessagesComponent } from './translated-messages/translated-messages.component';
@Component({
    selector: 'app-root',
    template: `
        <mat-tab-group>
            <mat-tab label="Template Driven Form">
                <app-template-driven-form class="content" />
            </mat-tab>
            <mat-tab label="Overridden Config"> <app-overridden-config class="content" /> </mat-tab>
            <mat-tab label="Translated Messages">
                <app-translated-messages class="content" />
            </mat-tab>
        </mat-tab-group>
    `,
    styles: [
        `
            :host {
                display: block;
                max-width: 600px;
                margin: 0 auto;
            }

            .content {
                display: block;
                padding: 1rem;
            }
        `,
    ],
    imports: [
        MatTabsModule,
        TemplateDrivenFormComponent,
        OverriddenConfigComponent,
        TranslatedMessagesComponent,
    ],
    standalone: true,
})
export class AppComponent {}
