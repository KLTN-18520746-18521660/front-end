import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

export class MyMissingTranslationHandler extends MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    return 'Missing Translation!';
  }
}