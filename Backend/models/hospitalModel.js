import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
   
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
  zipcode: {
    type: String,
    required: true,
  },
  constructed: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  bedNumber: {
    type: Number,
    required: true,
  },
  contact: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bed_occupied: {
    type: Object,
    default: {},
  },
});

const hospitalModel = mongoose.model('Hospital', hospitalSchema);

export default hospitalModel;
