import { Message } from '@tabletop-companion/api-interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageDTO implements Message {
  @Field({ nullable: true })
  message!: string;
}
