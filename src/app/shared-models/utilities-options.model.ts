export class AlertOptionsModel {
    instantShow?: boolean;
    callback?: any;
}

export class ToastOptionsModel {
    color?: null | 'danger' | 'success';
    duration?: number;
    position?: 'top' | 'bottom' | 'middle';
    buttons?: [
        {
            text: string;
            handler: any;
        }
    ]
}

export class CleanTextOptionsModel {
    trim?: boolean;
    lowerCase?: boolean;
    upperCase?: boolean;
    cleanSpecialCharacters?: boolean;
    english?: boolean;
    cleanVocalsVariations?: boolean;
}

export class FromDateToISOStringLocalOptionsModel {
    short?: boolean;
}