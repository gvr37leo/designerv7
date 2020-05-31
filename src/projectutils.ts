function addDefaultAttributes(def:AppDef){
    var idcounter = 1000
    for(var obj of def.objdefinitions){
        def.attributes.unshift(initAttribute((idcounter++).toString(),'_id',obj._id,DataType.id))
        def.attributes.push(initAttribute((idcounter++).toString(),'createdAt',obj._id,DataType.date))
        def.attributes.push(initAttribute((idcounter++).toString(),'lastupdate',obj._id,DataType.date))
    }
    return def
}

function createWidget(dataTypename:string,attribute:Attribute,designer:Designer){
    if(dataTypename == 'boolean'){
        return new BooleanWidget()
    }
    if(dataTypename == 'date'){
        return new DateWidget()
    }
    if(dataTypename == 'id'){
        return new IdWidget(attribute,designer)
    }
    if(dataTypename == 'number'){
        return new NumberWidget()
    }
    if(dataTypename == 'pointer'){
        return new PointerWidget(attribute,designer)
    }
    if(dataTypename == 'range'){
        return new RangeWidget()
    }
    if(dataTypename == 'string'){
        return new TextWidget()
    }
}

function emptyhtml(element:HTMLElement){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}