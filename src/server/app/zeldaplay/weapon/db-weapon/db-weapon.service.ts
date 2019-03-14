import { Injectable } from '@nestjs/common';

import { DbService } from '@Db/db.service';
import { DbWeapon } from '@DbModel/index';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DbWeaponService {
  private schema: string;

  constructor(private readonly dbService: DbService) {
    this.schema = 'zeldaplay';
  }

  getWeapons(charId: string): Observable<DbWeapon[]> {
    return this.dbService.query<DbWeapon>(
      `SELECT
        id as "wId"
        ,name as "wName"
        ,modifier as "wModifier"
        ,ammo as "wAmmo"
        ,range as "wRange"
        ,crit_damage as "wCritDamage"
        ,crit_range as "wCritRange"
        ,number_of_hits as "wNumberOfHits"
        ,type as "wType"
        ,damage as "wDamage"
      FROM ${this.schema}.weapons
      WHERE character_id = $1`,
      [charId]
    );
  }

  newWeapon(weapon: DbWeapon, charId: string): Observable<DbWeapon> {
    return this.dbService
      .query<DbWeapon>(
        `INSERT INTO ${this.schema}.weapons
      (name, modifier, ammo, range, crit_damage, crit_range, number_of_hits, type, damage, character_id) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id as wId`,
        [
          weapon.wName,
          weapon.wModifier,
          weapon.wAmmo,
          weapon.wRange,
          weapon.wCritDamage,
          weapon.wCritRange,
          weapon.wNumberOfHits,
          weapon.wType,
          weapon.wDamage,
          charId
        ]
      )
      .pipe(map((weapons) => weapons[0]));
  }

  updateWeapon(weapon: DbWeapon): Observable<DbWeapon> {
    return this.dbService
      .query<DbWeapon>(
        `UPDATE ${this.schema}.weapons as w
        SET name = inWeap.name
        ,modifier = inWeap.modifier
        ,ammo = inWeap.ammo
        ,range = inWeap.range
        ,crit_damage = inWeap.crit_damage
        ,crit_range = inWeap.crit_range
        ,number_of_hits = inWeap.number_of_hits
        ,type = inWeap.type
        ,damage = inWeap.damage
      FROM( VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9))
      AS inWeap(name, modifier, ammo, range, crit_damage, crit_range, number_of_hits, type, damage)
      WHERE w.id = ${weapon.wId}`,
        [
          weapon.wName,
          weapon.wModifier,
          weapon.wAmmo,
          weapon.wRange,
          weapon.wCritDamage,
          weapon.wCritRange,
          weapon.wNumberOfHits,
          weapon.wType,
          weapon.wDamage
        ]
      )
      .pipe(map((weapons) => weapons[0]));
  }
}
