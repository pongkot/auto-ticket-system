export abstract class MappingCore<ISchema, IModel> {
  abstract toModel(context: ISchema): IModel;
  abstract toObject(context: IModel): ISchema;
}
