async function updateVideo(req, res){
    const {title, description, allowDownload} = req.body;
    
}



export default (req, res) => {
    switch(req.method){
        case "PUT":
            updateVideo(req, res);
    }
}