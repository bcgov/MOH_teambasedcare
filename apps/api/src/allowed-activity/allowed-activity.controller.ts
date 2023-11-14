import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationRO } from '@tbcm/common';
import { AllowedActivityService } from './allowed-activity.service';
import { GetAllowedActivitiesByOccupationDto } from './dto/get-allowed-activities-by-occupation.dto';
import { GetAllowedActivitiesByOccupationRO } from './ro/get-allowed-activities-by-occupation.ro';

@ApiTags('allowedActivities')
@Controller('allowedActivities')
@UseInterceptors(ClassSerializerInterceptor)
export class AllowedActivityController {
  constructor(private allowedActivityService: AllowedActivityService) {}

  @Get('/occupation/:id')
  async getAllowedActivitiesByOccupation(
    @Param('id') occupationId: string,
    @Query() query: GetAllowedActivitiesByOccupationDto,
  ): Promise<PaginationRO<GetAllowedActivitiesByOccupationRO[]>> {
    const [allowedActivities, total] =
      await this.allowedActivityService.findAllowedActivitiesByOccupation(occupationId, query);

    return new PaginationRO([
      allowedActivities.map(
        allowedActivity => new GetAllowedActivitiesByOccupationRO(allowedActivity),
        total,
      ),
      total,
    ]);
  }
}