var express = require('express');
var adminRouter = express.Router();

function router(menu){
    adminRouter.route('/')
        .get(function(req,res){
        res.render('AddMovies',{title:'Admin Page',
                            menu:menu}
                )
    });


    return adminRouter;
}


module.exports =  router;