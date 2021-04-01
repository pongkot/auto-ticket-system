import {
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  UpdateWriteOpResult,
} from 'mongodb';
import { IDatabaseOption } from './interfaces';

export class Mongo<ISchema extends { _id: any }> {
  private dbOption: IDatabaseOption;
  private readonly mongoConnectionOption = { useUnifiedTopology: true };

  private opt: {
    collection: string;
    sort: any;
    limit: number;
  } = {
    collection: '',
    sort: null,
    limit: 0,
  };

  protected setDatabaseOption(o: IDatabaseOption): this {
    this.dbOption = o;
    return this;
  }

  protected getOptional(): IDatabaseOption {
    const option: IDatabaseOption = this.dbOption;
    if (!option) throw new Error('Database option invalid');
    return option;
  }

  protected collection(name: string): this {
    this.opt.collection = name;
    return this;
  }

  private getCollection(): string {
    return this.opt.collection;
  }

  protected insertOne(doc: ISchema): Promise<InsertOneWriteOpResult<ISchema>> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .insertOne(doc)
            .then((result: InsertOneWriteOpResult<ISchema>) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected insertMany(
    docs: Array<ISchema>,
  ): Promise<InsertWriteOpResult<ISchema>> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .insertMany(docs)
            .then((result: InsertWriteOpResult<ISchema>) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected findOne(filter: any): Promise<ISchema> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .findOne(filter)
            .then((result: ISchema) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected find(filter: any): Promise<ISchema[]> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    const sort: ISchema = this.opt.sort;
    const limit: number = this.opt.limit;
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .find(filter)
            .sort(sort)
            .limit(limit)
            .toArray()
            .then((result: ISchema[]) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected updateOne(
    query: any,
    updateValue: { $set: any },
  ): Promise<UpdateWriteOpResult> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .updateOne(query, updateValue)
            .then((result: UpdateWriteOpResult) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected updateMany(
    query: any,
    updateValue: { $set: any },
  ): Promise<UpdateWriteOpResult> {
    const url: string = this.getQueryStringConnect();
    const session: Promise<MongoClient> = MongoClient.connect(
      url,
      this.mongoConnectionOption,
    );
    const database: string = this.getOptional().database;
    const collection: string = this.getCollection();
    return new Promise((resolve, reject) => {
      session
        .then((connect: MongoClient) => {
          const dbo = connect.db(database);
          dbo
            .collection(collection)
            .updateMany(query, updateValue)
            .then((result: UpdateWriteOpResult) => {
              connect.close(() => {
                resolve(result);
              });
            });
        })
        .catch((sessionErr) => reject(sessionErr));
    });
  }

  protected sort(s: any): this {
    this.opt.sort = s;
    return this;
  }

  protected limit(l = 0): this {
    this.opt.limit = l;
    return this;
  }

  protected getQueryStringConnect(): string {
    let result: string;
    const option: IDatabaseOption = this.getOptional();

    if (!option.user || !option.password) {
      result = `localhost:${option.port}`;
    } else {
      result = `${option.user}:${option.password}@${option.host}:${option.port}`;
    }

    return `mongodb://${result}`;
  }
}
