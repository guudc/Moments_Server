/* Controller functions 
Author: Goodness E. COAT
Created: 10/03/24
*/
const { MAX_IMAGE_SIZE } = require("../../data.js")
const { USERDB, MOMENTDB } = require("../models/models.js")
const { googleAuth } = require("./api")
const fs = require('fs')
const path = require('path')
const { genId } = require("./utils.js")
const keccak256 = require('keccak256')

/** To authenticate users
 * Authentication is only via google for now
 * returns {token|String, status|boolean}
 */
exports.auth = async (req, res) => {
    const param = req.body
    if(param.auth) {
        //first verify google auth
        let resp = await googleAuth(param.auth) 
        if(resp.status) {
            resp = resp.userData
            //check if user exists
            USERDB.get({key:'userId', value:resp.authToken}, (status) => {
                const resData = {
                    userId:keccak256(resp.email).toString('hex'),
                    fullName:resp.name,
                    displayName:resp.given_name,
                    email:resp.email,
                    pic:resp.picture,
                    authId:resp.authToken,
                }
                if(status.status == true) {
                    //update user data
                    USERDB.save(resData,
                    (_status) => {
                        if(_status) {
                            res.send({status:true, user:resData})
                        }
                        else {
                            res.send({status:false, err:'Database error', errNo: 2000})
                        }
                    })
                }
                else {
                    //create new user data
                    USERDB.create(resData,
                        (_status) => {
                            if(_status) {
                                res.send({status:true, user:resData})
                            }
                            else {
                                res.send({status:false, err:'Database error', errNo: 2000})
                            }
                    })
                }
            })
        }
        else {
            res.send({status:false, err:'Something went wrong', errNo: 5000})
        }  
    }
    else {
        res.send({status:false, err:'auth not present', errNo: 1})
    }
}
/** To fetch user data
 * Authentication is only via google for now
 * returns {token|String, status|boolean}
 */
exports.user = async (req, res) => {
    const param = req.headers
    if(param.auth) {
        USERDB.get({key:'userId', value:param.auth}, (status, resData) => {
            if(status.status == true) {  
              res.send({status:true, user:resData})
            }
            else { 
                res.send({status:false, err:'user not present', errNo: 1000})
            }
        }) 
    }
    else {
        res.send({status:false, err:'auth not present', errNo: 1})
    }
}      
    
//to fetch moments data
exports.fetchMoments = async (req, res) => {
    const param = req.body
    if(param.id) {
        MOMENTDB.get({key:'id', value:param.id}, (status, resData) => {
            if(status.status == true) {  
               //read all moments data
               const dest = `moments/${resData.id}/bg/` 
               fs.access(dest, fs.constants.F_OK, (err) => {
                if (err) {
                    resData.moments = []
                    res.send({status:true, moments:resData})
                }
                // Read contents of the folder
                fs.readdir(dest, (err, files) => {
                    if (err) {
                        resData.moments = []
                        res.send({status:true, moments:resData})
                    }
    
                    const filesWithCreationDates = [];
                    let n =0;
                    // Loop through files in the folder
                    files.forEach((file) => {
                        let filePath = path.join(dest, file);
                        if(file.indexOf(resData.id) == -1) {
                            // return only files that are not the default bg
                            fs.stat(filePath, (err, stats) => {
                                n++
                                if (err) {
                                    return;
                                }
        
                                // Extract creation date from stats
                                const creationDate = stats.birthtime;
                                if(req.hostname == 'localhost') {
                                    //using localhost, append port too
                                    filePath = `${req.protocol}://${req.hostname}:4567/${filePath}`
                                }
                                else {
                                    filePath = `${req.protocol}://${req.hostname}/${filePath}`
                                }
                                // Add file path and creation date to the array
                                filesWithCreationDates.push({ moment: filePath.replace(/\\/g, '/'), date: creationDate });
                                
                                // Check if all files have been processed
                                if (n === files.length) {
                                    // Resolve with JSON string array
                                    resData.moments = filesWithCreationDates;
                                    res.send({status:true, moments:resData})
                                }
                            });
                        }
                        else {
                            n++
                            if (n === files.length) {
                                // Resolve with JSON string array
                                resData.moments = filesWithCreationDates;
                                res.send({status:true, moments:resData})
                            } 
                        }
                    });
                });
               });
            }
            else { 
                res.send({status:false, err:'moment not present', errNo: 2000})
            }
        }) 
    }
    else {
        res.send({status:false, err:'Moment id not found', errNo:2})
    }
}
//to fetch user moments
exports.fetchUserMoments = async (req, res) => {
    const param = req.body
    if(param.user) {
        MOMENTDB.getAllByUser(param.user, (status) => {   
            if(status.status == true) {  
               res.send({status:true, moments:status.data})
            }
            else { 
                res.send({status:false, err:'moment not present', errNo: 2000})
            }
        }) 
    }
    else {
        res.send({status:false, err:'Moment id not found', errNo:2})
    }
}
//to create moments
exports.createMoments = async (req, res) => {
    const param = req.body
    if(param.owner && param.name) {
        //save moments first
        const moment_id = genId()
        //check if image is present
        if(req.file) {
            const mime = req.file.mimetype
            if(mime.indexOf('image') > -1) {
                if(req.file.size <= MAX_IMAGE_SIZE) {
                    const fileName = "bg_" + moment_id + '_.png'
                    const dest = `moments/${moment_id}/bg/` 
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    fs.writeFileSync(dest + fileName, req.file.buffer)
                    if(req.hostname == 'localhost') {
                        //using localhost, append port too
                        newModel(`${req.protocol}://${req.hostname}:4567/${dest + fileName}`) 
                    }
                    else {
                        newModel(`${req.protocol}://${req.hostname}/${dest + fileName}`)
                    }
                                
                }
                else {
                    res.send({status:false, err:'image size too large', errNo:6000})
                }
            }
        }
        else {
            if(req.hostname == 'localhost') {
                //using localhost, append port too
                newModel(`${req.protocol}://${req.hostname}:4567/moments/default/bg/default.png`)
            }
            else {
                newModel(`${req.protocol}://${req.hostname}/moments/default/bg/default.png`)
            }
               
            
        }
        async function newModel(imgUri = "") {
            MOMENTDB.create({
                id:moment_id, 
                name:param.name,
                pic:imgUri || "",
                owner:param.owner,
            }, (status) => {
                if(status.status == true) {
                    res.send({status:true, id:moment_id, uri: '/' + moment_id})
                }
                else {
                    res.send({status:false, err:'database error', errNo:4})
                }
            })
        }
    }
    else {
        res.send({status:false, err:'Owner id not found', errNo:3})
    }
}
//to upload a moment
exports.uploadMoments = async (req, res) => {
    const param = req.body
    if(param.owner && param.id) {
        //save moments first
        const moment_id = param.id
        //check if image is present
        if(req.file) {
            const mime = req.file.mimetype
            if(mime.indexOf('image') > -1) {
                if(req.file.size <= MAX_IMAGE_SIZE) {
                    const fileName = "bg_" + (genId() + genId()) + '_.png'
                    const dest = `moments/${moment_id}/bg/` 
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }
                    fs.writeFileSync(dest + fileName, req.file.buffer)
                    if(req.hostname == 'localhost') {
                        //using localhost, append port too
                        res.send({status:true, moment:`${req.protocol}://${req.hostname}:4567/${dest + fileName}`, date:(new Date()).getTime()}) 
                    }
                    else {
                        res.send({status:true, moment: `${req.protocol}://${req.hostname}/${dest + fileName}`, date:(new Date()).getTime()})
                    }
                                
                }
                else {
                    res.send({status:false, err:'image size too large', errNo:6000})
                }
            }
        }
        else {
            res.send({status:false, err:'moment not found', errNo:7000})
        }
    }
    else {
        res.send({status:false, err:'Owner id not found', errNo:3})
    }
}