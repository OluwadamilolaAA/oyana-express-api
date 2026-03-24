import { BadRequestException } from '@nestjs/common';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireNonEmptyString(
  value: string | undefined,
  fieldName: string,
): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new BadRequestException(`${fieldName} is required`);
  }

  return normalizedValue;
}

export function requireEmail(value: string | undefined): string {
  const normalizedValue = requireNonEmptyString(value, 'Email');

  if (!EMAIL_PATTERN.test(normalizedValue)) {
    throw new BadRequestException('A valid email address is required');
  }

  return normalizedValue.toLowerCase();
}

export function requirePassword(
  value: string | undefined,
  minimumLength = 8,
): string {
  const normalizedValue = requireNonEmptyString(value, 'Password');

  if (normalizedValue.length < minimumLength) {
    throw new BadRequestException(
      `Password must be at least ${minimumLength} characters long`,
    );
  }

  return normalizedValue;
}
