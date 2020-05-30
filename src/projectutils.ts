function addDefaultAttributes(def:AppDef){
    var idcounter = 1000
    for(var obj of def.objdefinitions){
        def.attributes.unshift(initAttribute((idcounter++).toString(),'_id',obj._id,DataType.id))
        def.attributes.push(initAttribute((idcounter++).toString(),'createdAt',obj._id,DataType.date))
        def.attributes.push(initAttribute((idcounter++).toString(),'lastupdate',obj._id,DataType.date))
    }
    return def
}

function createWidget(dataType:DataType,attribute:Attribute,designer:Designer){
    if(dataType == DataType.boolean){
        return new BooleanWidget()
    }
    if(dataType == DataType.date){
        return new DateWidget()
    }
    if(dataType == DataType.enum){
        return new EnumWidget(attribute.enumDataTypes)
    }
    if(dataType == DataType.id){
        return new IdWidget(attribute,designer)
    }
    if(dataType == DataType.number){
        return new NumberWidget()
    }
    if(dataType == DataType.pointer){
        return new PointerWidget(attribute,designer)
    }
    if(dataType == DataType.range){
        return new RangeWidget()
    }
    if(dataType == DataType.string){
        return new TextWidget()
    }
}

function emptyhtml(element:HTMLElement){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}