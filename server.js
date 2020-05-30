
var mongodb = require('mongodb')
var express = require("express")
var bodyParser = require("body-parser")
var path = require("path")

var url = 'mongodb://localhost:27017';
var databasename = 'company'
var app = express();
app.use(bodyParser.json());//for json encoded http body's
app.use(bodyParser.urlencoded({ extended: false }));//for route parameters
app.use(express.static('./'));

var port = 8000;
// var exampledefinition = JSON.parse(fs.readFileSync('./public/definition.json','utf8'));
start()

app.listen(port, function(){
    console.log('listening on ' + port)
})

function start(){
    const client = new mongodb.MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

    client.connect().then(() => {
        console.log('connected to mongo');
        var db = client.db(databasename)
        

        app.post('/api/export', function(req, res){
            var appdef = req.body.appdef
            var promises = []
            var exportresult = {}
            for(var objdef of appdef.objdefinitions){
                promises.push(db.collection(objdef.name).find({}).toArray())
            }
            Promise.all(promises).then(collections => {
                for(var i = 0; i < collections.length; i++){
                    exportresult[appdef.objdefinitions[i].name] = collections[i]
                }
                res.send(exportresult)
            })
        })

        app.post('/api/search/:object', function(req, res){
            var collection = db.collection(req.params.object)
            var query = req.body;
            if(query.filter._id){
                query.filter._id = new mongodb.ObjectID(query.filter._id)
            }
            collection.find(query.filter).sort(query.sort).skip(query.paging.skip * query.paging.limit).limit(query.paging.limit).toArray(function(err, result){
                collection.countDocuments({}).then((count) => {
                    res.send({
                        data:result,
                        collectionSize:count
                    });
                })
            })
        })
    
        app.get('/api/:object/:id', function(req, res){
            var collection = db.collection(req.params.object)
            collection.findOne({_id:new mongodb.ObjectID(req.params.id)}).then(function(doc){
                res.send(doc);
            })
        })
    
        app.post('/api/:object', function(req, res){
            var collection = db.collection(req.params.object)
    
            for(var item of req.body){
                delete item._id
                item.createdAt = Date.now()
            }
            
            collection.insertMany(req.body, function(err, result){
                if(err)res.send(err)
                else res.send({
                    status:'success',
                    insertedIds:Object.values(result.insertedIds).map(id => id.toString()),
                });
            });
        })
    
        app.put('/api/:object/:id', function(req, res){
            var collection = db.collection(req.params.object)
    
            delete req.body._id
            req.body.lastupdate = new Date().getTime()
            collection.updateOne({_id:new mongodb.ObjectID(req.params.id)}, {$set:req.body}, function(err, result){
                if(err)res.send(err);
                else res.send({status:'success'});
            })
        })
    
        app.delete('/api/:object', function(req, res){
            var collection = db.collection(req.params.object)
    
            collection.deleteMany({_id: { $in: req.body.map(id => mongodb.ObjectID(id))}}, function(err, result){
                if(err)res.send(err)
                else res.send({status:'success'});
            })
        })
        
        app.get('/*', function(req, res, next) {
            res.sendFile(path.resolve('index.html'));
        });





    },(reason) => {
        console.log(reason)
        console.log('error connecting to mongodb retrying in 5 seconds')
        
        setTimeout(start,5000)
    })

}








