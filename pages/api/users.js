import fs from 'fs';
import path from 'path';

export default (req, res) => {
    if(req.method === "GET"){

    }
    else if(req.method === "POST"){
        const { userId, password, name, profile } = req.body;

        const root = __filename;
        const savePath = root + "public/images/profiles";
        console.log(root);
        // let read = fs.readdirSync(__filename)
        // console.log(read);
        
        // fs.writeFile()
        res.status(200).json({name: "next.js"});
    }
}