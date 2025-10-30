const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    category_name:{
        type: String
    },
    category_img:{
        type: String
    }

})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category