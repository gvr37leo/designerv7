

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

function getList(objname:string,query:Query):Promise<{collectionSize:number,data:any[]}>{
    return fetch(`/api/search/${objname}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(query)
    }).then(res => res.json())
}

function get(objname:string, id:string){
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
            reffedAttributes:[]
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
    reffedAttributes:Dereference[]
    paging:{
        skip:number
        limit:number
    }
}

type QueryResult<T> = {
    data:T[]
    collectionSize:number
    dataSize:number
    reffedObjects:{[k:string]:{[s:string]:any}}
}

type PostResponse = {
    status:string
    insertedIds:string[]
}