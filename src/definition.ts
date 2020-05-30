function initAppDef(databaseName,objdefinitions:ObjDef[],attributes:Attribute[]):AppDef{
    return {databaseName,objdefinitions,attributes}
}

type AppDef = {
    databaseName: string,
    objdefinitions:ObjDef[],
    attributes:Attribute[],
}

function initObjDef(_id,name,displayAttribute,):ObjDef{
    return {_id,name,displayAttribute,}
}

type ObjDef = {
    _id:string,
    name:string,
    displayAttribute:string,
}

type Datatype2 = {
    _id:string,
    name:string,
}

function initAttribute(_id,name,belongsToObject,dataType:DataType,):Attribute{
    return {_id,name,belongsToObject,dataType}
}

function initEnumAttribute(_id,name,belongsToObject,dataType:DataType,enumDataTypes:string[]):Attribute{
    return {_id,name,belongsToObject,dataType,enumDataTypes}
}

function initPointerAttribute(_id,name,belongsToObject,dataType:DataType,pointsToObject):Attribute{
    return {_id,name,belongsToObject,dataType,pointsToObject}
}

type Attribute = {
    _id:string,
    name: string,
    belongsToObject:string,
    dataType:DataType,

    pointsToObject?:string
    enumDataTypes?:string[]
}


enum DataType{
    string = 'text',
    date = 'date',
    range = 'range',
    number = 'number',
    pointer = 'pointer',
    id = 'id',
    enum = 'enum',
    boolean = 'boolean'
}

