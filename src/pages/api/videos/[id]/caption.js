import Video from '../../../../../models/video';

function updateCaption(req, res){
    const {caption, vidx} = req.body;
    
}

export default (req, res) => {
    switch(req.method){
        case "PUT":
            updateCaption(req, res);
            break;
    }
}