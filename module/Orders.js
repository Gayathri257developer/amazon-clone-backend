const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    price: {
        type: Number,
        require: true,
    },
    products:{
        type: Array,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    address: {
        type: Object,
        require: true,
    },
},
{
    timestamps : true,
  }

)
module.exports= mongoose.model("orders",OrderSchema);