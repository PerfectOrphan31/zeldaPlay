import { Injectable } from '@nestjs/common';
import {
  Character,
  CharacterId,
  CharacterInsertData,
  CharacterUpdateData,
  UserId
} from '@tabletop-companion/api-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CharacterService {
  constructor(private readonly db: DatabaseService) {}

  getCharacterById(id: CharacterId): Observable<Character> {
    const fields: string[] = [];
    fields.push('id as id');
    fields.push('name as name');
    fields.push('race as race');
    fields.push('subrace as subrace');
    fields.push('experience as experience');
    fields.push('max_health as "maxHealth"');
    fields.push('health as health');
    fields.push('is_dead as "isDead"');
    fields.push('player_id as "playerId"');
    fields.push('level as level');
    fields.push('alignment as alignment');
    fields.push('background as background');
    fields.push('ideal as ideal');
    fields.push('bond as bond');
    fields.push('flaw as flaw');
    fields.push('personality_traits as "personalityTraits"');
    fields.push('proficiencies as proficiencies');
    fields.push('languages as languages');
    fields.push('game as game');
    const query =
      'SELECT ' + fields.join(', ') + ' FROM characters WHERE id = $1;';
    return this.db
      .query<Character>({
        query,
        variables: [id.id]
      })
      .pipe(map((characters) => characters[0]));
  }

  getCharactersByUserId(userId: UserId): Observable<Character[]> {
    const fields: string[] = [];
    fields.push('id as id');
    fields.push('name as name');
    fields.push('race as race');
    fields.push('subrace as subrace');
    fields.push('experience as experience');
    fields.push('max_health as "maxHealth"');
    fields.push('health as health');
    fields.push('is_dead as "isDead"');
    fields.push('player_id as "playerId"');
    fields.push('level as level');
    fields.push('alignment as alignment');
    fields.push('background as background');
    fields.push('ideal as ideal');
    fields.push('bond as bond');
    fields.push('flaw as flaw');
    fields.push('personality_traits as "personalityTraits"');
    fields.push('proficiencies as proficiencies');
    fields.push('languages as languages');
    fields.push('game as game');
    const query =
      'SELECT ' + fields.join(', ') + ' FROM characters WHERE player_id = $1;';
    return this.db.query<Character>({
      query,
      variables: [userId.id]
    });
  }

  insertNewCharacter(
    characterData: CharacterInsertData
  ): Observable<Character> {
    const params: { values: string[]; fields: string[] } = {
      values: [],
      fields: []
    };
    const charVariables: any[] = [];
    let query = 'INSERT INTO characters (';
    params.fields.push('name');
    charVariables.push(characterData.name);
    params.fields.push('race');
    charVariables.push(characterData.race);
    params.fields.push('subrace');
    charVariables.push(characterData.subrace);
    params.fields.push('experience');
    charVariables.push(characterData.experience);
    params.fields.push('max_health');
    charVariables.push(characterData.maxHealth);
    params.fields.push('health');
    charVariables.push(characterData.health);
    params.fields.push('is_dead');
    charVariables.push(characterData.isDead);
    params.fields.push('player_id');
    charVariables.push(characterData.playerId);
    params.fields.push('level');
    charVariables.push(characterData.level);
    params.fields.push('alignment');
    charVariables.push(characterData.alignment);
    params.fields.push('background');
    charVariables.push(characterData.background);
    params.fields.push('ideal');
    charVariables.push(characterData.ideal);
    params.fields.push('bond');
    charVariables.push(characterData.bond);
    params.fields.push('flaw');
    charVariables.push(characterData.flaw);
    params.fields.push('personality_traits');
    charVariables.push(characterData.personalityTraits);
    params.fields.push('proficiencies');
    charVariables.push(characterData.proficiencies);
    params.fields.push('languages');
    charVariables.push(characterData.languages);
    params.fields.push('game');
    charVariables.push(characterData.game);
    for (let i = 1; i <= params.fields.length; i++) {
      params.values.push(`$${i}`);
    }
    query += params.fields.join(', ');
    query += ') VALUES (';
    query += params.values.join(', ');
    query += ') RETURNING id;';
    return this.db.query<Character>({ query, variables: charVariables }).pipe(
      map((characters) => characters[0]),
      map((character) => {
        for (const key of Object.keys(characterData)) {
          character[key] = characterData[key];
        }
        return character;
      })
    );
  }

  updateCharacter(characterData: CharacterUpdateData): Observable<Character> {
    return this.db
      .query<Character>({ query: '', variables: [] })
      .pipe(map((characters) => characters[0]));
  }
}
