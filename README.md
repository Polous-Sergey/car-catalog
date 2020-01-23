# Car Catalog

> Car Catalog was developed using TypeORM, Nest.js and Node.js.

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/Polous-Sergey/car-catalog.git

# 2. Enter your newly-cloned folder.
cd car-catalog

# 3. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn

# 4. Run development server and open http://localhost:3000
yarn start:dev
```

## Manufacturer

### Structure

Field|Data Type|Required|Restrictions
:-----|:-----|:-----|:-----
`name`|String|Required|No less than 2 and no more than 30 characters must be present.
`phone`|String|Required|Valid phone number with international prefix.
`siret`|String|Required|14-figure numerical identifier of any French establishment or business.

### Entity

```typescript
@Entity({ name: 'manufacturers' })
export class ManufacturerEntity extends AbstractEntity {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  phone: string;

  @ApiModelProperty()
  @Column({ type: 'bigint' })
  siret: number;

  @OneToMany(
    () => CarEntity,
    car => car.manufacturer,
  )
  public cars: CarEntity[];
}
```

## Car

### Structure

Field|Data Type|Required|Restrictions
:-----|:-----|:-----|:-----
`manufacturerId`|String|Required|UUID string, reference to 'manufacturer.id'.
`price`|Number|Required|No less than 1 and no more than 21474836.
`firstRegistrationDate`|DateString|Optional|String is a complete representation of a date.

### Entity

```typescript
@Entity({ name: 'cars' })
export class CarEntity extends AbstractEntity {
  @ApiModelProperty()
  @Column()
  price: number;

  @ApiModelProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  firstRegistrationDate: Date;

  @ApiModelProperty({
    type: ManufacturerEntity,
  })
  @ManyToOne(
    () => ManufacturerEntity,
    manufacturer => manufacturer.cars,
    {
      onDelete: 'CASCADE',
    },
  )
  public manufacturer: ManufacturerEntity;

  @ApiModelProperty({
    type: OwnerEntity,
    isArray: true,
  })
  @OneToMany(
    () => OwnerEntity,
    owner => owner.car,
  )
  public owners: OwnerEntity[];
}
```

## Owner

### Structure

Field|Data Type|Required|Restrictions
:-----|:-----|:-----|:-----
`carId`|String|Required|UUID string, reference to 'car.id'.
`name`|String|Required|No less than 2 and no more than 30 characters must be present.
`purchaseDate`|DateString|Optional|String is a complete representation of a date.

### Entity

```typescript
@Entity({ name: 'owners' })
export class OwnerEntity extends AbstractEntity {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;

  @ManyToOne(
    () => CarEntity,
    car => car.owners,
    {
      onDelete: 'CASCADE',
    },
  )
  public car: CarEntity;
}
```

### Server-Side Data Validation

class-validator is used to validate data on the server.

```typescript
export class ManufacturerCreateDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @IsPhoneNumber('ZZ')
  phone: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  @Max(99999999999999)
  @IsSiret({
    message: 'Invalid siret',
  })
  siret: number;
}
```
```typescript
export class CarCreateDto {
  @ApiModelProperty()
  @IsUUID()
  manufacturerId: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(21474836)
  price: number;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  firstRegistrationDate: string;
}
```
```typescript
export class OwnerCreateDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiModelProperty()
  @IsUUID()
  carId: string;

  @ApiModelPropertyOptional()
  @IsDateString()
  @IsOptional()
  purchaseDate: string;
}
```

## Architecture

### Server

Nest.js is used for handling http-requests.

TypeORM is used for work with Postgres.

#### RESTful API

More detail about API you can find in the swagger doc, just run the app and move to http://localhost:3000/documentation

URL|HTTP Method|Body of Request|Response
:-----|:-----|:-----|:-----
`/manufacturer`|`GET`|—|Page of manufacturers
`/manufacturer`|`POST`|JSON|Create manufacturer
`/manufacturer?id`|`PUT`|JSON|Update manufacturer
`/manufacturer?id`|`DELETE`|—|Deleted manufacturer
`/car`|`GET`|—|Page of car with manufacturer and owners
`/car/manufacturer`|`GET`|—|Car manufacturer
`/car`|`POST`|JSON|Create car
`/car?id`|`PUT`|JSON|Update car
`/car?id`|`DELETE`|—|Deleted car
`/owner`|`GET`|—|Page of owners
`/owner`|`POST`|JSON|Create owner
`/owner?id`|`PUT`|JSON|Update owner
`/owner?id`|`DELETE`|—|Deleted owner

