function initAppDef(objdefinitions:ObjDef[],attributes:Attribute[]):AppDef{

    var datatypes = ['string','date','range','number','pointer','id','boolean']
    return {objdefinitions,attributes,dataTypes:datatypes.map((type,i) => {
        return {_id:(i + 1).toString(),name:type}
    })}
}

type AppDef = {
    objdefinitions:ObjDef[],
    attributes:Attribute[],
    dataTypes:DataTypeDef[],
}

function initObjDef(_id,name,displayAttribute,):ObjDef{
    return {_id,name,displayAttribute,}
}

type ObjDef = {
    _id:string,
    name:string,
    displayAttribute:string,
}

type Attribute = {
    _id:string,
    name: string,
    belongsToObject:string,
    dataType:string,

    pointsToObject?:string
    enumDataTypes?:string[]
}

type DataTypeDef = {
    _id:string,
    name:string,
}

function initAttribute(_id,name,belongsToObject,dataType:string,):Attribute{
    return {_id,name,belongsToObject,dataType}
}

function initPointerAttribute(_id,name,belongsToObject,dataType:string,pointsToObject):Attribute{
    return {_id,name,belongsToObject,dataType,pointsToObject}
}



enum DataType{
    string = '1',
    date = '2',
    range = '3',
    number = '4',
    pointer = '5',
    id = '6',
    boolean = '7'
}

