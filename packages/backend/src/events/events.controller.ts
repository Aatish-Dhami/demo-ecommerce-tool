import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateEventDto,
  EventsQueryDto,
  PaginatedResponseDto,
} from '@flowtel/shared';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEventDto: CreateEventDto | CreateEventDto[],
  ): Promise<Event | Event[]> {
    if (Array.isArray(createEventDto)) {
      return this.eventsService.createBatch(createEventDto);
    }
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll(
    @Query() query: EventsQueryDto,
  ): Promise<PaginatedResponseDto<Event>> {
    return this.eventsService.findAll(query);
  }
}
