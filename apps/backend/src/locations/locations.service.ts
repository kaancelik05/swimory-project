import { Injectable, NotFoundException } from '@nestjs/common';
import { AffiliateLink, Location as LocationModel, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapLocation(location: LocationModel & { affiliateLinks: AffiliateLink[]; favoritedBy: { id: string }[] }) {
    const { favoritedBy, coordinates, ...rest } = location;
    return {
      ...rest,
      coordinates: coordinates as unknown as { latitude: number; longitude: number },
      favoritedByIds: favoritedBy.map((fav) => fav.id),
    };
  }

  async create(input: CreateLocationInput) {
    const { coordinates, affiliateLinks, ...rest } = input;
    const data: Prisma.LocationCreateInput = {
      ...rest,
      coordinates: coordinates as Prisma.JsonObject,
      affiliateLinks: affiliateLinks
        ? {
            create: affiliateLinks.map((link) => ({ ...link })),
          }
        : undefined,
    };

    const location = await this.prisma.location.create({
      data,
      include: { affiliateLinks: true, favoritedBy: { select: { id: true } } },
    });
    return this.mapLocation(location);
  }

  async findAll() {
    const locations = await this.prisma.location.findMany({
      include: { affiliateLinks: true, favoritedBy: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return locations.map((location) => this.mapLocation(location));
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: { affiliateLinks: true, favoritedBy: { select: { id: true } } },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return this.mapLocation(location);
  }

  async update(id: string, input: UpdateLocationInput) {
    await this.findOne(id);
    const { coordinates, affiliateLinks, ...rest } = input;
    const location = await this.prisma.location.update({
      where: { id },
      data: {
        ...rest,
        ...(coordinates ? { coordinates: coordinates as Prisma.JsonObject } : {}),
        ...(affiliateLinks
          ? {
              affiliateLinks: {
                deleteMany: {},
                create: affiliateLinks.map((link) => ({ ...link })),
              },
            }
          : {}),
      },
      include: { affiliateLinks: true, favoritedBy: { select: { id: true } } },
    });

    return this.mapLocation(location);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.location.delete({ where: { id } });
    return true;
  }
}
