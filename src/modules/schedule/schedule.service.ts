import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import { LessThanOrEqual } from 'typeorm';

import { OwnerRepository } from '../owner/owner.repository';

@Injectable()
export class ScheduleService {
  constructor(public readonly ownerRepository: OwnerRepository) {
    const rule = new RecurrenceRule();
    rule.hour = 12;
    scheduleJob(rule, this.ownerRemover.bind(this));
  }

  async ownerRemover(): Promise<void> {
    const startDate = moment()
      .subtract(18, 'm')
      .toISOString();
    const ownerIds = await this.ownerRepository
      .find({
        select: ['id'],
        where: {
          purchaseDate: LessThanOrEqual(startDate),
        },
      })
      .then(owners => owners.map(owner => owner.id));
    const deleteResult = await this.ownerRepository.delete(ownerIds);
    console.info('Remove owners', deleteResult);
  }
}
