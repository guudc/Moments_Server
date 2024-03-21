/* 
    This is a route function
    containing route to main components
    of the payment system
*/
const express = require("express")
const router = express.Router()
const multer = require('multer')
const controller = require('../controllers/controllers.js')
const dataParser = require('body-parser')
const fs = require('fs')
const path = require('path')
router.use(dataParser.json({extended:true}))
const paths = __dirname.substring(0, __dirname.indexOf("src")) 
router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', '*');
    next();
});
const uploadImages = multer({
    storage:multer.memoryStorage()
})
router.post('/moments', controller.fetchMoments)
router.post('/upload', uploadImages.single('photo'), controller.uploadMoments)
router.post('/getall', controller.fetchUserMoments)
router.post('/create', uploadImages.single('photo'), controller.createMoments)
router.post('/auth', controller.auth)
router.post('/user', controller.user)

//listen to 404 request
router.get("*", (req, res) =>{
    let tm = req.url
    console.log(path.join(paths, tm))
    if(fs.existsSync(path.join(paths, tm))){  console.log(path.join(paths, tm))
        res.sendFile(path.join(paths, tm))
    }
    else{
        res.status(404).json({
            success: false,
            message: "Page not found",
            error: {
                statusCode: 404,
                message:
                    "You are trying to access a route that is not defined on this server."
            }
        })
    }
})

//exports router
module.exports = router
    
