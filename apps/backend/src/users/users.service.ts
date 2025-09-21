import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

const userInclude = {
  favorites: {
    include: {
      affiliateLinks: true,
      favoritedBy: { select: { id: true } },
    },
  },
} as const;

type LocationWithRelations = Prisma.LocationGetPayload<{
  include: { affiliateLinks: true; favoritedBy: { select: { id: true } } };
}>;

type UserWithFavorites = Prisma.UserGetPayload<{ include: typeof userInclude }>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private mapFavoriteLocation(location: LocationWithRelations) {
    const { favoritedBy, coordinates, ...rest } = location;
    return {
      ...rest,
      coordinates: coordinates as unknown as { latitude: number; longitude: number },
      favoritedByIds: favoritedBy.map((fav) => fav.id),
    };
  }

  private mapUser(user: UserWithFavorites) {
    const { favorites, ...rest } = user;
    return {
      ...rest,
      favorites: favorites.map((favorite) => this.mapFavoriteLocation(favorite)),
    };
  }

  async create(input: CreateUserInput) {
    const { password, ...rest } = input;
    const hashed = await bcrypt.hash(password, 10);
    const data: Prisma.UserCreateInput = {
      ...rest,
      password: hashed,
    };
    const user = await this.prisma.user.create({
      data,
      include: userInclude,
    });
    return this.mapUser(user as UserWithFavorites);
  }

  findAll() {
    return this.prisma.user
      .findMany({
        include: userInclude,
        orderBy: { createdAt: 'desc' },
      })
      .then((users: UserWithFavorites[]) => users.map((user) => this.mapUser(user)));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.mapUser(user as UserWithFavorites);
  }

  findByEmail(email: string) {
    return this.prisma.user
      .findUnique({
        where: { email },
        include: userInclude,
      })
      .then((user: UserWithFavorites | null) => (user ? this.mapUser(user) : null));
  }

  async update(id: string, input: UpdateUserInput) {
    await this.findOne(id);
    const { password, ...rest } = input;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(password ? { password: await bcrypt.hash(password, 10) } : {}),
      },
      include: userInclude,
    });
    return this.mapUser(user as UserWithFavorites);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async updateRole(id: string, role: Role) {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      include: userInclude,
    });
    return this.mapUser(user as UserWithFavorites);
  }

  toggleFavorite(userId: string, locationId: string, favorite: boolean) {
    return this.prisma.user
      .update({
        where: { id: userId },
        data: {
          favorites: favorite
            ? { connect: { id: locationId } }
            : { disconnect: { id: locationId } },
        },
        include: userInclude,
      })
      .then((user: UserWithFavorites) => this.mapUser(user));
  }
}
