const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
  'email': {
    type: String,
    required: true
  },
  'password': {
    type: String,
    required: true
  },
  timetables: [{
    'cw': {
      type: Number,
      required: true
    },
    'startDate': {
      type: Date,
      required: true
    },
    'endDate': {
      type: Date,
      required: true
    },
    'days': [
      {
        'real': {
          type: Date,
          required: true
        },
        'display': {
          type: String,
          required: true
        },
        'canWork': {
          type: Boolean,
          required: true,
          default: false
        }
      }
    ],
    'remark': {
      type: String,
      required: false
    }
  }]
})

module.exports = mongoose.model('User', user)