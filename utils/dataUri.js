const DataUri= require('datauri/parser.JS');
const path = require('path');


const getDataUri=(file)=>{
    const parser = new DataUriParser()
    const extName = path.extname(file.originalName).toString();
    console.log(extName)
    return parser.format(extName,file.content);

}

module.exports = getDataUri;