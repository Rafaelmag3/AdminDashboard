import { SchemaPath, validate } from '@angular/forms/signals';
import { RegexConstants } from '@constants/regex.contants';

export function phoneNumber(path: SchemaPath<string>, options?: { message?: string }): void {
    validate(path, ({ value }) => {
        if (!value()) {
            return null;
        }
        let regex = RegexConstants.PHONE_NUMBER_REGEX;
        if (value().includes('+')) {
            regex = RegexConstants.PHONE_NUMBER_WITH_IDENTIFIER_REGEX;
        }
        const countSimbols = [...value()].filter((char) => char === '+').length;
        if (countSimbols > 1) {
            return {
                kind: 'phoneNumber',
                message: options?.message || 'Invalid phone number'
            }
        }
        if (!regex.test(value())) {
            return {
                kind: 'phoneNumber',
                message: options?.message || 'Invalid phone number'
            }
        }
        return null;
    })
}