export class CurrentUserDto {
  sub!: number;
  name!: string;
  email!: string;
  organizationId!: string;

  constructor(data: CurrentUserDto) {
    Object.assign(this, data);
  }
}
