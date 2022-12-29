const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
{
   title: {
    type: String,
    require: true,
   },
    imageURL: {
        type: String,
        require: true,
    },
    category:{
        type: String,
        require: true,
    },
    price:{
        type: Number,
        require: true,
    },
    rating: {
        type: Number,
    require: true,
    }
},
{
    timestamps : true,
  }
  )

module.exports = mongoose.model('products',ProductSchema)