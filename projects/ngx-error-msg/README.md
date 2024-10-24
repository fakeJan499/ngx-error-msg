# NgxErrorMsg

The error message mapping library for Angular.

## Features

- Dynamic directive that display error message.
- Support for use with reactive and template driven forms.
- Support for use with i18n libraries.
- Support for standalone components and Angular modules.

## Dependencies

|Angular |
|:-------|
|15 to 18|

## Installation

```bash
npm install ngx-error-msg --save
```

## Usage

### Standalone directive

The `*ngxErrorMsg` directive can be used without configuring providers globally.
In such a case, the `ngxErrorMsgMappings` input is required.

> **_NOTE:_**  When using NgModules, import `NgxErrorMsgModule`.

```typescript
@Component({
    template: `
       <input
            name="title"
            [(ngModel)]="title"
            required
            minlength="5"
            maxlength="10"
            #titleControl="ngModel" />
        <span *ngxErrorMsg="titleControl.errors; mappings: errorMappings; let message">
            {{ message }}
        </span>
    `,
    imports: [FormsModule, NgxErrorMsgDirective],
    standalone: true,
})
export class AppComponent {
    title = 'example-modules';
    errorMappings: ErrorMessageMappings = {
        required: 'Title is required',
        minlength: error => `Title min length is ${error.requiredLength}`,
        maxlength: error => `Title max length is ${error.requiredLength}`,
    };
}
```

### Global configuration

**Step 1:** Create a base error mapper.

```typescript
@Injectable()
export class BaseErrorMsgMapperService extends NgxErrorMsgService {
  protected override readonly errorMsgMappings = {
    required: 'This field is required.',
    minlength: (error) =>
      `This field must be at least ${error.requiredLength} characters long.`,
    maxlength: (error) =>
      `This field must be at most ${error.requiredLength} characters long.`,
  };
}
```

**Step 2:** Provide error mapper globally.

```typescript
bootstrapApplication(AppComponent, {
    providers: [
        provideNgxErrorMsg(BaseErrorMsgMapperService, {errorsLimit: 1}), // The config object is optional.
        // ...
    ],
});
```

or using Angular module

```typescript
@NgModule({
  imports: [
    NgxErrorMsgModule.forRoot(BaseErrorMsgMapperService),
  ],
  // ...
})
export class AppModule {}
```

**Step 3:** Use the directive.

```typescript
@Component({
    template: `
        <span *ngxErrorMsg="control.errors; let message">
            {{ message }}
        </span>
    `,
    imports: [NgxErrorMsgDirective],
    standalone: true,
})
export class AppComponent {
    control = new FormControl('', [Validators.required]);
}
```

### Translated messages

_NgxErrorMsg_ library supports mappings to Observable making it possible to use i18n error messages.

```typescript
@Injectable()
export class BaseErrorMsgMapperService extends NgxErrorMsgService {
  translate = inject(TranslateService); // Or use any other i18n library.

  protected override readonly errorMsgMappings = {
    required: () => this.translate.get('ERRORS.REQUIRED'),
    minlength: (error) => this.translate.get('ERRORS.MIN_LENGTH', {value: error.requiredLength}),
    maxlength: (error) => this.translate.get('ERRORS.MAX_LENGTH', {value: error.requiredLength}),
  };
}
```

### Overriding messages and config

The error message mapping priority is based on two factors:

1. DI tree - mappings of error messages from services closer to the directive are prioritized.
2. Order in mappings object - error mappings defined first are prioritized.

```typescript
@Injectable()
export class BaseErrorMsgMapperService extends NgxErrorMsgService {
  protected override readonly errorMsgMappings = {
    email: 'This field is not email.',
    maxlength: `Value too long.`,
  };
}

bootstrapApplication(AppComponent, {
    providers: [
        provideNgxErrorMsg(BaseErrorMsgMapperService, {errorsLimit: -1}), // Don't limit mapped errors.
        // ...
    ],
});
```

``` typescript
@Injectable()
export class ComponentErrorMsgMapperService extends NgxErrorMsgService {
  protected override readonly errorMsgMappings = {
    maxlength: `The value is too long.`,
  };
}

@Component({
    template: `
        <span *ngxErrorMsg="control.errors; mappings: errorMappings; let message">
            {{ message }} <!-- Title max length is 1. Must be an email. -->
        </span>

        <span *ngxErrorMsg="control.errors; let message">
            {{ message }} <!-- The value is too long. This field is not email. -->
        </span>

        <span *ngxErrorMsg="control.errors; config: {errorsLimit: 1}; let message">
            {{ message }} <!-- The value is too long. -->
        </span>
    `,
    imports: [NgxErrorMsgDirective],
    providers: [provideNgxErrorMsg(ComponentErrorMsgMapperService),],
    standalone: true,
})
export class AppComponent {
    control = new FormControl('long', [Validators.email, Validators.maxLength(1)]);

    errorMappings: ErrorMessageMappings = {
        maxlength: error => `Title max length is ${error.requiredLength}.`,
        email: 'Must be an email.',
    };
}
```

### Using context

Context is designed to pass any additional data that is not part of the error object to error mapping functions.

Context may be passed directly to the directive or be provided using the `provideNgxErrorMsgContext` function.

```typescript
@Injectable()
export class Mapper extends NgxErrorMsgService {
  protected override readonly errorMsgMappings = {
    required: (error, ctx) => `${ctx?.fieldName || 'This field'} is required.`,
  };
}
```

```html
<span *ngxErrorMsg="emailControl.errors; ctx: {fieldName: 'Email'}; let message">
    {{ message }} 
</span>
```
