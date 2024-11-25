import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type DoctorSchemaDocument = HydratedDocument<DoctorSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class DoctorSchemaClass extends EntityDocumentHelper {
  @Prop({
    required: true,
    type: Types.ObjectId,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: [String],
  })
  professionalDocuments: string[];

  @Prop({
    required: true,
    type: Boolean,
  })
  approved: boolean;

  @Prop({
    required: true,
    type: [String],
  })
  specialties: string[];

  @Prop({
    required: true,
    type: [
      {
        dayOfWeek: String,
        timeSlots: [
          {
            start_time: String,
            end_time: String,
          },
        ],
      },
    ],
  })
  availability: {
    dayOfWeek: string;
    timeSlots: { startTime: string; endTime: string }[];
  }[];

  @Prop({
    required: true,
    type: {
      city: String,
      state: String,
    },
  })
  location: {
    city: string;
    postalCode: string;
  };

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const DoctorSchema = SchemaFactory.createForClass(DoctorSchemaClass);
