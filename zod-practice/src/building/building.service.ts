import { Injectable } from '@nestjs/common';
import { Building } from '../../libs/dto/src/index.js';
import { CreateBuildingDto, FindBuildingsQueryDto, UpdateBuildingDto } from './building.dto';

@Injectable()
export class BuildingService {
  // In-memory store per TODO.md ("Use an in-memory store ... the focus is on
  // the API structure and validation, not persistence"). Keyed by buildingId.
  private readonly buildings = new Map<string, Building>();

  findAll(_query: FindBuildingsQueryDto): { data: Building[]; total: number } {
    // TODO(you): return every building, filtered by `_query.leaseType` and/or
    // `_query.status` when those are present (both are optional — an absent
    // filter means "don't filter on this field"). Wrap the result in
    // `{ data, total }` per the required response envelope.
    throw new Error('BuildingService.findAll() not implemented yet');
  }

  findOne(_id: string): Building {
    // TODO(you): look up the building by id. If it doesn't exist, throw
    // `NotFoundException` from '@nestjs/common' (maps to HTTP 404) rather than
    // returning undefined.
    throw new Error('BuildingService.findOne() not implemented yet');
  }

  create(_dto: CreateBuildingDto): Building {
    // TODO(you): assign a generated `buildingId` (the schema leaves it optional
    // — no ulid generator is wired up yet, so a simple id scheme is fine, e.g.
    // an incrementing counter or `crypto.randomUUID()`), store it in the map,
    // and return the stored building.
    throw new Error('BuildingService.create() not implemented yet');
  }

  update(_id: string, _dto: UpdateBuildingDto): Building {
    // TODO(you): merge `_dto` into the existing building (throw NotFoundException
    // if `_id` isn't in the map), persist the merged result, and return it.
    throw new Error('BuildingService.update() not implemented yet');
  }
}
