export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export abstract class BaseEntity {
  protected readonly id: BaseEntityProps['id'];
  protected readonly createdAt: BaseEntityProps['createdAt'];
  protected readonly updatedAt: BaseEntityProps['updatedAt'];
  protected readonly deletedAt: BaseEntityProps['deletedAt'];

  constructor(data: BaseEntityProps) {
    Object.assign(this, data);
  }

  abstract serialize(): Record<string, unknown>;

  getId(): string {
    return this.id;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
