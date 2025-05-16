const {request,response} = require('express');
const bcrypt = require('bcryptjs');

const mainGet = async (req = request, res = response)=> {
return res.status(200).json({
    msg: 'get API - controlador modificado',
})
}


module.exports = {
    mainGet,
}