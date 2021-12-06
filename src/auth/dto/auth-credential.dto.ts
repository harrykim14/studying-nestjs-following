import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  // Matches(pattern: RegExp, validationOptions?: ValidationOptions)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english charactor and number',
  })
  password: string;
}
