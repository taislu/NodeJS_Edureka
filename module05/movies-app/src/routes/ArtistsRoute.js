var express = require('express');
var artistRouter = express.Router();

function router(menu){
    artistRouter.route('/')
        .get(function(req,res){
        res.render('artists',{title:'Atists Page',
                            menu:menu}
                )
    });

    artistRouter.route('/details')
        .get(function(req,res){
        res.send('Artists Details')
    })

    return artistRouter;
}


module.exports =  router;