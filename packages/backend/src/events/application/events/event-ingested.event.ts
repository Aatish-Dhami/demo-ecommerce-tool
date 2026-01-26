export class EventIngestedEvent {
  constructor(
    public readonly eventId: string,
    public readonly shopId: string,
    public readonly eventType: string,
    public readonly timestamp: string,
  ) {}
}

export class BatchEventsIngestedEvent {
  constructor(
    public readonly eventIds: string[],
    public readonly shopId: string,
    public readonly count: number,
    public readonly timestamp: string,
  ) {}
}
