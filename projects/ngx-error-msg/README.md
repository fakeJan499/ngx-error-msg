# NgxErrorMsg

![pipeline status](https://github.com/fakeJan499/ngx-error-msg/actions/workflows/ci.yml/badge.svg)
![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fakeJan499_ngx-error-msg&metric=coverage)
![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fakeJan499_ngx-error-msg&metric=reliability_rating)
![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fakeJan499_ngx-error-msg&metric=security_rating)
![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fakeJan499_ngx-error-msg&metric=vulnerabilities)

The error message mapping library for Angular.

[Live Demo](https://stackblitz.com/edit/ngx-error-msg-example)

## Features

✅ Dynamic display of error message  
✅ Reactive and template driven forms support  
✅ I18n libraries support  
✅ SSR support  
✅ Standalone support

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

```html
<input
    name="title"
    [(ngModel)]="title"
    required
    minlength="5"
    maxlength="10"
    #titleControl="ngModel" />
<span *ngxErrorMsg="titleControl.errors; mappings: errorMappings; let mappedErrors">
    {{ mappedErrors.message }}
    <!-- Or use {{ mappedErrors.messages }} to access each mapped error message separately. -->
</span>

```

```typescript
@Component({
    // ...
    imports: [FormsModule, NgxErrorMsgDirective],
    standalone: true,
})
export class AppComponent {
    title = 'example';
    errorMappings: ErrorMessageMappings = {
        required: 'Title is required',
        minlength: error => `Title min length is ${error.requiredLength}`,
        maxlength: error => `Title max length is ${error.requiredLength}`,
    };
}
```

### Provided configuration

Mappings and configuration can be defined at any level using providers.
For example, all commonly used error messages and configuration can be defined at the root level and
extended or overridden in child providers or on a [directive level](#standalone-directive).

```typescript
provideNgxErrorMsg(
    withMappings({
        required: (_, ctx) => `${ctx.field ?? 'This field'} is required.`,
        minlength: error => `Minimum length is ${error.requiredLength}.`,
    }),
    withConfig({ errorsLimit: 1 }),
)
```

### Translated messages

_NgxErrorMsg_ library supports mappings to Observable making it possible to use i18n error messages.

```typescript
provideNgxErrorMsg(
    withMappings(() => {
        const translate = inject(TranslateService); // Or use any other i18n library.

        return {
            required: () => translate.get('ERRORS.REQUIRED'),
            minlength: error =>
                translate.get('ERRORS.MIN_LENGTH', { value: error.requiredLength }),
        };
    }),
)
```

### Error messages prioritization

By default the order of mapped error messages is based on the order in the mappings object (e.g. provided by `withMappings`). This behavior can be overridden by using one of predefined prioritizers or defining a custom one.

``` typescript
withConfig({
    messagesPrioritizer: (errors, mappings) => {
        const errorsOrder = ['required', 'minlength', 'email'];

        return (errA, errB) => {
            return errorsOrder.indexOf(errA) - errorsOrder.indexOf(errB);
        };
    },
})
```

> **_NOTE:_**  The `messagesPrioritizer` function **is not** executed in an injection context. To use injected values, a factory configuration provider must be used.

```typescript
withConfig(() => {
    const service = inject(MyService); 
    return {};
})
```
