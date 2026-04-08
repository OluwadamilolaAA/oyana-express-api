import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleType!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @ApiProperty()
  @IsBoolean()
  isAvailable!: boolean;
}

export class UpdateDriverProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  onboardingStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approvalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activeVehicleAssignmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class ReviewDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  approvalStatus!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reviewedBy!: string;
}

export class UpsertDriverStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty()
  @IsBoolean()
  isAvailable!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpsertDriverDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  verificationStatus?: string;
}

export class ListVehicleTypesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}

export class UpsertVehicleTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ default: 4 })
  @IsOptional()
  @IsNumber()
  maxPassengers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxLoadKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ListVehiclesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerDriverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleTypeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}

export class UpsertVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plateNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  make!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleTypeId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerDriverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}

export class AssignVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleId!: string;
}

export class UnassignVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assignmentId!: string;
}
