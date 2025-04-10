import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../../enum/appointments.enum';

export type AppointmentSchemaDocument =
  HydratedDocument<AppointmentSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AppointmentSchemaClass extends EntityDocumentHelper {
  @Prop({
    required: true,
    type: {
      patientId: Types.ObjectId,
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
  })
  patientInfo: {
    patientId: Types.ObjectId;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };

  @Prop({
    required: true,
    type: {
      doctorId: Types.ObjectId,
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
  })
  doctorInfo: {
    doctorId: Types.ObjectId;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
  };

  @Prop({
    type: String,
    required: true,
  })
  service: string;

  @Prop({
    type: Date,
    required: true,
  })
  appointmentDate: Date;

  @Prop({
    type: {
      startTime: String,
      endTime: String,
    },
    required: true,
  })
  timeSlot: {
    startTime: string;
    endTime: string;
  };

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'failed'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: String,
  })
  notes: string;

  @Prop({
    type: [String],
  })
  files: string[];

  @Prop({
    type: Number,
    required: true,
  })
  cost: number;

  @Prop({
    type: String,
    default: 'VND',
  })
  currency: string;

  @Prop({
    type: {
      method: {
        type: String,
        enum: Object.values(PaymentMethod),
      },
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
    },
  })
  payment: {
    method: string;
    status: string;
  };

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(
  AppointmentSchemaClass,
);
