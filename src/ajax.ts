

function createList(objname:string, data:any[]):Promise<{insertedIds:string[],status:string}>{
    return fetch(`/api/${objname}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(data)
    }).then(res => res.json())
}

function create(objname:string,data:any):Promise<string>{
    return new Promise((res,rej) => {
        createList(objname,[data]).then(data => {
            res(data.insertedIds[0])
        })
    })
}

function createKnotAndObjectByName(designer:Designer,parentknot:string, objname:string,object:any){
    var def = designer.definition.objdefinitions.find(od => od.name == objname)
    return createKnotAndObject(def,parentknot,object)
}

function createKnotAndObject(objdef:ObjDef,parentknot:string,object:any):Promise<string>{
    return new Promise((resolve,rej) => {
        create(objdef.name,object).then(res => {
            var knotdata:Knot = {
                _id:'',
                name:'generatedKnot',
                parent:parentknot,
                objid:res,
                objdef:objdef._id,
            }
            create('knot', knotdata).then(e => {
                resolve(e)
            })    
        })
    })
    
}


function getAll(objname:string){
    return getList(objname,{dereferences:[],filter:{},paging:{
        limit:0,
        skip:0,
    },
    sort:{}})
}

function getList(objname:string,query:Query):Promise<QueryResult<any>>{
    return fetch(`/api/search/${objname}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(query)
    }).then(res => res.json())
}

function get(objname:string, id:string):Promise<any>{
    return new Promise((resolve,rej) => {
        getList(objname,{
            filter:{
                _id:id,
            },
            paging:{
                limit:0,
                skip:0,
            },
            sort:{},
            dereferences:[]
        }).then(result => {
            resolve(result.data[0])
        })
    })
    
}

function update(objname:string,id:string, data:any){
    return fetch(`/api/${objname}/${id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'PUT',
        body:JSON.stringify(data)
    })
}

// function update(objname:string, data:any){
//     return updateList(objname,[data])
// }

function deleteList(objname:string,ids:string[]){
    return fetch(`/api/${objname}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'DELETE',
        body:JSON.stringify(ids)
    })
}

function del(objname:string,id:string){
    return deleteList(objname,[id])
}

function exportDB(appdef:AppDef){
    return fetch(`/api/export`,{
        body:JSON.stringify({appdef:appdef}),
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
    }).then(res => res.json())
}

type Dereference = {
    attribute:string
    collection:string
    dereferences:Dereference[]
}

type Query = {
    filter:any
    sort:any
    dereferences:Dereference[]
    paging:{
        skip:number
        limit:number
    }
}

type QueryResult<T> = {
    data:T[]
    collectionSize:number
    prelimitsize:number
    reffedObjects:any[]
}

type PostResponse = {
    status:string
    insertedIds:string[]
}