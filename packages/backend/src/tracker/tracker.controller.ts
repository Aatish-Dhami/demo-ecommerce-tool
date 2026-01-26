import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller()
export class TrackerController {
  private readonly trackerPath: string;

  constructor() {
    this.trackerPath = path.resolve(
      process.cwd(),
      '../tracker/dist/tracker.js',
    );
  }

  @Get('tracker.js')
  async getTrackerScript(@Res() res: Response): Promise<void> {
    try {
      const script = await fs.readFile(this.trackerPath, 'utf-8');

      res.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      });

      res.status(HttpStatus.OK).send(script);
    } catch {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Tracker script not found. Run pnpm build:tracker first.',
      });
    }
  }
}
