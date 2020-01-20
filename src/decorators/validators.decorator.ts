import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';
import * as siret from 'siret';

// eslint-disable-next-line @typescript-eslint/tslint/config
export function IsSirit(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'IsSirit',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: number, _args: ValidationArguments) {
                    return siret.isSIRET(value);
                },
            },
        });
    };
}
