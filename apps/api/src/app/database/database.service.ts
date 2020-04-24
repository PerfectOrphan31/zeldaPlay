import { Inject, Injectable, Scope } from '@nestjs/common';
import { OgmaService, OgmaLogger } from '@ogma/nestjs-module';
import { Pool } from 'pg';
import { from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DATABASE_FEATURE, DATABASE_POOL } from './database.constants';
import {
  DatabaseFeatureOptions,
  DatabaseInterface,
  InsertParams,
  QueryParams,
  UpdateManyParams,
  UpdateParams,
} from './interfaces/database.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class DatabaseService<T> implements DatabaseInterface<T> {
  tableName: string;

  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
    @Inject(DATABASE_FEATURE)
    readonly feature: DatabaseFeatureOptions,
    @OgmaLogger(DatabaseService)
    private readonly logger: OgmaService,
  ) {
    this.tableName = feature.tableName;
  }

  private runQuery(query: string, params: any[]): Observable<T[]> {
    const start = Date.now();
    return from(this.pool.query(query, params)).pipe(
      tap((qRes) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
          rows: qRes.rowCount,
        });
      }),
      map((qRes) => qRes.rows),
      catchError((err) => {
        this.logger.debug({
          query,
          time: Date.now() - start,
        });
        this.logger.printError(err);
        return of([]);
      }),
    );
  }

  query(params: QueryParams): Observable<T[]> {
    const query =
      'SELECT ' +
      params.query +
      ' FROM ' +
      this.tableName +
      ' WHERE ' +
      params.where;
    return this.runQuery(query, params.variables);
  }

  insert(params: InsertParams): Observable<T[]> {
    const query =
      'INSERT INTO ' +
      this.tableName +
      ' (' +
      params.query +
      ') VALUES (' +
      params.where +
      ') RETURNING id;';
    return this.runQuery(query, params.variables);
  }

  // tslint:disable-next-line: no-identical-functions
  update(params: UpdateParams): Observable<T[]> {
    const query =
      'UPDATE ' +
      this.tableName +
      ' SET ' +
      params.query +
      ' WHERE ' +
      params.where +
      ' RETURNING id;';
    return this.runQuery(query, params.variables);
  }

  updateMany(params: UpdateManyParams): Observable<T[]> {
    const query =
      'UPDATE ' +
      this.tableName +
      ' AS ' +
      params.tableAlias +
      ' SET ' +
      params.query +
      ' FROM ' +
      params.tempTable +
      ' WHERE ' +
      params.where +
      ';';
    return this.runQuery(query, params.variables);
  }

  delete(params: QueryParams): Observable<T[]> {
    return of([]);
  }
}
