import { IsNumber, IsString, IsOptional, IsEnum, Length, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CareActivitiesFindSortKeys, SortOrder } from '@tbcm/common';

export class FindCareActivitiesDto {
  @ApiProperty({
    required: false,
    type: String,
    example: 'Screen patients',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  @Transform(({ value }) => value?.trim())
  readonly searchText?: string = '';

  @ApiProperty({
    required: false,
    type: String,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Math.floor(Math.max(Number(value), 1)))
  readonly page: number = 1;

  @ApiProperty({
    required: false,
    type: String,
    example: 12,
  })
  @IsNumber()
  @IsOptional()
  @Max(50)
  @Transform(({ value }) => Math.floor(Math.max(Number(value), 1)))
  readonly pageSize: number = 10;

  @ApiProperty({
    required: false,
    type: CareActivitiesFindSortKeys,
    example: CareActivitiesFindSortKeys.DISPLAY_NAME,
  })
  @IsString()
  @IsEnum(CareActivitiesFindSortKeys)
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({
    required: false,
    type: SortOrder,
    example: SortOrder.DESC,
  })
  @IsString()
  @IsEnum(SortOrder)
  @IsOptional()
  readonly sortOrder?: string;
}
