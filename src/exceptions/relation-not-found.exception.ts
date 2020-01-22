import { NotFoundException } from '@nestjs/common';

export class RelationNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.relation_not_found', error);
  }
}
