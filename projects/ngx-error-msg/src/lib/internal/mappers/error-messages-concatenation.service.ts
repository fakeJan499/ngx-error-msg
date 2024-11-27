import { Injectable } from '@angular/core';
import { MappedMessage } from './types';

@Injectable({ providedIn: 'root' })
export class ErrorMessageConcatenationService {
    concat(messages: MappedMessage[], separator: string): string {
        return messages.map(x => x.message).join(separator);
    }
}
