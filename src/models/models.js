/* 
    This is a model function
    containing database to main components
*/

//Import the mongoose module
const mongoose = require('mongoose');
const schema = mongoose.Schema

//Set up default mongoose connection
const mongoDB = 'mongodb+srv://Indo:AyDUGCFq1lH1Vri6@cluster0.1o3kiu8.mongodb.net/Indo';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
console.log("Connected")

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

class _USERDB{
    /*
        This class controls the user
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model("userV1", {
            userId:String, 
            password:String,
            email:String,
            authId:String,
            fullName:String,
            displayName:String,
            pic:String,
            data:Object,
        });
    }

    create(params, callback){
      /*
        This callbacktions create a new user
        data and store in the database
        It returns the user Id
      */
       //create id
       let userData = {
            userId:params.userId || uuidv4(), 
            password:params.password || "",
            email:params.email || "",
            authId:params.authId || "",
            fullName:params.fullName || "",
            displayName:params.displayName || "",
            pic:params.pic || "",
            data:{}    
       }
       new this.model(userData)
       .save()
       .then(err =>{
        
           callback({status:true}, userData.userId) 
       })
       .catch(err => {
            callback({status:'error',msg:'Internal database error'})
       })
     }
    get(params, callback){
      /*
        This callback get a user
        data and returns it as a json data
      */
          if(params){
            let query = {};
            query[params.key] = params.value;
            //find the request dat
            this.model.find(query)
            .then(res =>{  
                if(res != null){  
                     if(res.length > 0){
                        res = res[0]
                        callback({status:true}, {
                                userId:res.userId, 
                                password:res.password || "",
                                email:res.email || "",
                                authId:res.authId || "",
                                fullName:res.fullName || "",
                                displayName:res.displayName || "",
                                pic:res.pic || "",
                                data:res.data
                        })
                     }
                    else{callback({status:'error',msg:'No user with id found'})}
                }
                else{callback({status:'error',msg:'No user with id found'})}
            })
            .catch(err => {  
                callback({status:'error',msg:'Internal database error'})
            })
           
       }
       else{
           //no request id found
           callback({status:'error',msg:'No user id present'})
       }
    }
    getAllNum(num, callback){
        /*
          This callbacktions get all users
          data and returns it as Json data
        */    
          this.model.find({}).limit(num)
          .then(res => {
                    if(res != null){  
                         if(res.length > 0){
                            callback({status:true, data:res})
                         }
                        else{callback({status:'error',msg:'No user found'})}
                    }
                    else{callback({status:'error',msg:'No user found'})}
          })
          .catch(err => {
              callback({status:'error',msg:'Internal database error'})
          })
    }
    getAll(callback){
        /*
          This callbacktions get all users
          data returns the user Json data
        */    
        this.model.find({})
        .then(res => {  
                  if(res != null){  
                       if(res.length > 0){
                          callback({status:true, data:res})
                       }
                      else{callback({status:'error',msg:'No user found'})}
                  }
                  else{callback({status:'error',msg:'No user found'})}
        })
        .catch(err => { 
            callback({status:'error',msg:'Internal database error'})
        })
    }
    save(params, callback){
        /*
         This callback saves or modify a user
         data and store in the database
         It returns either true|false|null
       */ 
        //get the specified request from database
        if(params.userId != undefined && params.userId != null){
             //first find the proposal
            this.model.find({'userId':params.userId})
            .then(res =>{
                if(res != null){//console.log(res)
                     if(res.length > 0){ 
                        res = res[0]
                        const propertiesToCopy = [
                            'fullName',
                            'password',
                            'email',
                            'displayName',
                            'about',
                            'pic',
                            'location',
                            'website',
                            'lastLogin',
                            'techStack',
                            'verified',
                            'data'
                        ];
                          
                        // Loop through the properties and assign them if they exist in params
                        propertiesToCopy.forEach((prop) => {
                          if (params[prop]) {
                            res[prop] = params[prop];
                          }
                        });
                        this.model.findOneAndUpdate({'userId':params.userId}, res,{new:true})
                        .then(res =>{
                            if(res != null){
                                callback({status:true})
                            }                         
                        })
                        .catch(err => {
                           callback({status:'error',msg:'Internal database error'})
                        })
                     }
                    else{callback({status:'error',msg:'No user with id found'})}
                }
                else{callback({status:'error',msg:'No user with id found'})}
            })
            .catch(err => {
                callback({status:'error',msg:'Internal database error'})
            })    
        }
        else{
            //no request id found
            callback({status:'error',msg:'No user id found'})
        }
    }
    
}
class _MOMENTDB{
    /*
        This class controls the moment
        model database connection
    */
    model = null;
    constructor(){
        //initialize database schema
        this.model = mongoose.model("momentV1", {
            id:String, 
            name:String,
            pic:String,
            num:Number,
            date:Number,
            owner:String,
            closed:Boolean,
            data:Object,
        });
    }

    create(params, callback){
      /*
        This callbacktions create a new user
        data and store in the database
        It returns the user Id
      */
       //create id
       let userData = {
            id:params.id || uuidv4(), 
            name:params.name || "",
            pic:params.pic || "",
            num:0,
            date:(new Date()).getTime(),
            owner:params.owner,
            closed:false,
            data:{}    
       }
       new this.model(userData)
       .save()
       .then(err =>{
        
           callback({status:true}, userData.userId) 
       })
       .catch(err => {
            callback({status:'error',msg:'Internal database error'})
       })
     }
    get(params, callback){
      /*
        This callback get a user
        data and returns it as a json data
      */
          if(params){
            let query = {};
            query[params.key] = params.value;
            //find the request dat
            this.model.find(query)
            .then(res =>{  
                if(res != null){  
                     if(res.length > 0){
                        res = res[0]
                        callback({status:true}, {
                            id:res.id,
                            name:res.name || "",
                            pic:res.pic || "",
                            num:res.num || 0,
                            date:res.date || (new Date()).getTime(),
                            owner:res.owner,
                            closed:res.closed,
                            data:res.data
                        })
                     }
                    else{callback({status:'error',msg:'No moment with id found'})}
                }
                else{callback({status:'error',msg:'No moment with id found'})}
            })
            .catch(err => {  
                callback({status:'error',msg:'Internal database error'})
            })
           
       }
       else{
           //no request id found
           callback({status:'error',msg:'No user id present'})
       }
    }
    getAllNum(num, callback){
        /*
          This callbacktions get all users
          data and returns it as Json data
        */    
          this.model.find({}).limit(num)
          .then(res => {
                    if(res != null){  
                         if(res.length > 0){
                            callback({status:true, data:res})
                         }
                        else{callback({status:'error',msg:'No moment found'})}
                    }
                    else{callback({status:'error',msg:'No moment found'})}
          })
          .catch(err => {
              callback({status:'error',msg:'Internal database error'})
          })
    }
    getAll(callback){
        /*
          This callbacktions get all users
          data returns the user Json data
        */    
        this.model.find({})
        .then(res => {  
                  if(res != null){  
                       if(res.length > 0){
                          callback({status:true, data:res})
                       }
                      else{callback({status:'error',msg:'No moment found'})}
                  }
                  else{callback({status:'error',msg:'No moment found'})}
        })
        .catch(err => { 
            callback({status:'error',msg:'Internal database error'})
        })
    }
    getAllByUser(userId, callback){
        /*
          This callbacktions get all users moments
          data returns the user Json data
        */    
        this.model.find({owner:userId}).sort({date: -1})
        .then(res => {  
                  if(res != null){  
                       if(res.length > 0){
                          callback({status:true, data:res})
                       }
                      else{callback({status:'error',msg:'No moment found'})}
                  }
                  else{callback({status:'error',msg:'No moment found'})}
        })
        .catch(err => { 
            callback({status:'error',msg:'Internal database error'})
        })
    }
    save(params, callback){
        /*
         This callback saves or modify a user
         data and store in the database
         It returns either true|false|null
       */ 
        //get the specified request from database
        if(params.userId != undefined && params.userId != null){
             //first find the proposal
            this.model.find({'userId':params.userId})
            .then(res =>{
                if(res != null){//console.log(res)
                     if(res.length > 0){ 
                        res = res[0]
                        const propertiesToCopy = [
                            'name',
                            'closed',
                            'data'
                        ];
                          
                        // Loop through the properties and assign them if they exist in params
                        propertiesToCopy.forEach((prop) => {
                          if (params[prop]) {
                            res[prop] = params[prop];
                          }
                        });
                        this.model.findOneAndUpdate({'id':params.id}, res,{new:true})
                        .then(res =>{
                            if(res != null){
                                callback({status:true})
                            }                         
                        })
                        .catch(err => {
                           callback({status:'error',msg:'Internal database error'})
                        })
                     }
                    else{callback({status:'error',msg:'No moment with id found'})}
                }
                else{callback({status:'error',msg:'No moment with id found'})}
            })
            .catch(err => {
                callback({status:'error',msg:'Internal database error'})
            })    
        }
        else{
            //no request id found
            callback({status:'error',msg:'No moment id found'})
        }
    }
    
}

exports.USERDB  = new _USERDB()
exports.MOMENTDB  = new _MOMENTDB()
