import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as schedule from 'node-schedule';
import { MoreThan } from 'typeorm';

import { OwnerRepository } from '../owner/owner.repository';

@Injectable()
export class ScheduleService {
    constructor(public readonly ownerRepository: OwnerRepository) {
        schedule.scheduleJob('40 * * * *', this.ownerRemover);
    }

    async ownerRemover(): Promise<void> {
        const endDate = moment()
            .add(18, 'm')
            .toISOString();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const owners = await this.ownerRepository.find({
            purchaseDate: MoreThan(endDate),
        });
        // console.log('executing interval job', owners);
    }
}
