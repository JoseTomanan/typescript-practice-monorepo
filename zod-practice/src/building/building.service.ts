import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Building } from '../../libs/dto/src/index.js';
import { CreateBuildingDto, FindBuildingsQueryDto, UpdateBuildingDto } from './building.dto';

@Injectable()
export class BuildingService {
  // In-memory store per TODO.md ("Use an in-memory store ... the focus is on
  // the API structure and validation, not persistence"). Keyed by buildingId.
  private readonly buildings = new Map<string, Building>();

  findAll(query: FindBuildingsQueryDto): { data: Building[]; total: number } {
    const data = [...this.buildings.values()].filter(
      (building) =>
        (query.leaseType === undefined || building.leaseType === query.leaseType) &&
        (query.status === undefined || building.status === query.status),
    );
    return { data, total: data.length };
  }

  findOne(id: string): Building {
    const building = this.buildings.get(id);
    if (!building) {
      throw new NotFoundException(`Building '${id}' not found`);
    }
    return building;
  }

  create(dto: CreateBuildingDto): Building {
    const buildingId = randomUUID();
    const building: Building = { ...dto, buildingId };
    this.buildings.set(buildingId, building);
    return building;
  }

  update(id: string, dto: UpdateBuildingDto): Building {
    const existing = this.findOne(id);
    // Keep the original id even if the partial body happened to carry one.
    const updated: Building = { ...existing, ...dto, buildingId: id };
    this.buildings.set(id, updated);
    return updated;
  }
}
