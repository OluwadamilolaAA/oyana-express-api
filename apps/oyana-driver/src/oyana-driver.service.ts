import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import {
  CreateDriverRequest,
  CreateDriverResponse,
  Driver,
  GetDriverRequest,
  GetDriverResponse,
  ListDriversRequest,
  ListDriversResponse,
  requireNonEmptyString,
  UpdateDriverRequest,
  UpdateDriverResponse,
} from '@package/packages';
import { DRIVER_REPOSITORY } from './provider/driver.providers';
import { DriverProfileEntity } from './entity/driver.entity';

@Injectable()
export class OyanaDriverService {
  constructor(
    @Inject(DRIVER_REPOSITORY)
    private readonly driverRepository: MongoRepository<DriverProfileEntity>,
  ) {}

  async createDriver(
    request: CreateDriverRequest,
  ): Promise<CreateDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const vehicleType = requireNonEmptyString(
      request.vehicleType,
      'Vehicle type',
    );
    const licenseNumber = requireNonEmptyString(
      request.licenseNumber,
      'License number',
    );

    const existingDriver = await this.driverRepository.findOne({
      where: [{ userId }, { licenseNumber }],
    });

    if (existingDriver) {
      throw new ConflictException('Driver profile already exists');
    }

    const driver = this.driverRepository.create({
      userId,
      vehicleType,
      licenseNumber,
      isAvailable: true,
    });

    const savedDriver = await this.driverRepository.save(driver);

    return { driver: this.toGrpcDriver(savedDriver) };
  }

  async getDriver(request: GetDriverRequest): Promise<GetDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const driver = await this.driverRepository.findOne({ where: { userId } });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    return { driver: this.toGrpcDriver(driver) };
  }

  async updateDriver(
    request: UpdateDriverRequest,
  ): Promise<UpdateDriverResponse> {
    const userId = requireNonEmptyString(request.userId, 'User id');
    const vehicleType = requireNonEmptyString(
      request.vehicleType,
      'Vehicle type',
    );
    const licenseNumber = requireNonEmptyString(
      request.licenseNumber,
      'License number',
    );

    if (typeof request.isAvailable !== 'boolean') {
      throw new BadRequestException('Availability flag is required');
    }

    const driver = await this.driverRepository.findOne({ where: { userId } });

    if (!driver) {
      throw new NotFoundException('Driver profile not found');
    }

    driver.vehicleType = vehicleType;
    driver.licenseNumber = licenseNumber;
    driver.isAvailable = request.isAvailable;

    const updatedDriver = await this.driverRepository.save(driver);

    return { driver: this.toGrpcDriver(updatedDriver) };
  }

  async listDrivers(request: ListDriversRequest): Promise<ListDriversResponse> {
    const drivers = await this.driverRepository.find({
      where: request.onlyAvailable ? { isAvailable: true } : {},
    });

    return {
      drivers: drivers.map((driver) => this.toGrpcDriver(driver)),
    };
  }

  private toGrpcDriver(driver: DriverProfileEntity): Driver {
    return {
      userId: driver.userId,
      vehicleType: driver.vehicleType,
      licenseNumber: driver.licenseNumber,
      isAvailable: driver.isAvailable,
    };
  }
}
