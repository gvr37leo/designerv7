/// <reference path="./src/designer.ts" />
//todo
//save and load definition in database
//use knots for contentree
//implement knot/obj creation/deletion serverside
//ui for allowednodes/chosing documenttype beneath node
//filtering done via list of filters instead of columns
//have a getIdentifyingProperty() method on objects and attributes



let objectidcounter = 1
let objectdefinition = initObjDef((objectidcounter++).toString(),'objdefinitions',null)
let attributedefinition = initObjDef((objectidcounter++).toString(),'attributes',null)
let datatypedefinition = initObjDef((objectidcounter++).toString(),'dataTypes',null)

let datatypeidcounter = 1
let datatypeid = initAttribute((datatypeidcounter++).toString(),'_id','3',DataType.id)
let datatypename = initAttribute((datatypeidcounter++).toString(),'name','3',DataType.string)

let attributeidcounter = 1
let objid = initAttribute((attributeidcounter++).toString(),'_id','1',DataType.id)
let objname = initAttribute((attributeidcounter++).toString(),'name','1',DataType.string)
let objDisplayAttriubte  = initPointerAttribute((attributeidcounter++).toString(),'displayAttribute','1',DataType.pointer,null)

let atrid = initAttribute((attributeidcounter++).toString(),'_id','2',DataType.id)
let atrname = initAttribute((attributeidcounter++).toString(),'name','2',DataType.string)
let atrdatatype = initPointerAttribute((attributeidcounter++).toString(),'dataType','2',DataType.pointer,datatypedefinition._id)
var atrbelongstoobject = initPointerAttribute((attributeidcounter++).toString(),'belongsToObject','2',DataType.pointer,objectdefinition._id)
var atrpointstoObject = initPointerAttribute((attributeidcounter++).toString(),'pointsToObject','2',DataType.pointer,objectdefinition._id)

objDisplayAttriubte.pointsToObject = attributedefinition._id
atrbelongstoobject.pointsToObject = objid._id
atrpointstoObject.pointsToObject = objid._id
objectdefinition.displayAttribute = objname._id
attributedefinition.displayAttribute = atrname._id
datatypedefinition.displayAttribute = datatypename._id



var selfdef = initAppDef([
    objectdefinition,
    attributedefinition,
    datatypedefinition,
],[
    objid,
    objname,
    objDisplayAttriubte,

    atrid,
    atrname,
    atrbelongstoobject,
    atrdatatype,
    atrpointstoObject,//requires custom code to hide this field when datatype isnt pointer

    datatypeid,
    datatypename,
])

var persoonbedrijfdef = initAppDef([
    initObjDef('1','persoon','1'),
    initObjDef('2','bedrijf','6'),
    initObjDef('3','persoonWerktBijBedrijf',null),
    initObjDef('4','branchtypes','12'),
],[
    initAttribute('1','name','1',DataType.string),
    initAttribute('2','homeless','1',DataType.boolean),
    initAttribute('3','birthday','1',DataType.date),
    initAttribute('4','lengte','1',DataType.number),
    initPointerAttribute('5','vriend','1',DataType.pointer,'1'),

    initAttribute('6','name','2',DataType.string),
    initPointerAttribute('7','branch','2',DataType.pointer,'4'),
    initAttribute('8','rating','2',DataType.range),

    initPointerAttribute('9','werknemer','3',DataType.pointer,'1'),
    initPointerAttribute('10','werkgever','3',DataType.pointer,'2'),
    initAttribute('11','salaris','3',DataType.number),

    initAttribute('12','name','4',DataType.string),
])


let globaldesigner:Designer = null
globaldesigner = new Designer(addDefaultAttributes(persoonbedrijfdef),document.body)
// loadSelfDefDesigner()


function loadSelfDefDesigner(){
    var useddef = selfdef
    globaldesigner = new Designer(useddef as any,document.body)
    var exportbutton = string2html(`<button>export</button>`)
    exportbutton.addEventListener('click',() => {
        exportDB(useddef).then(res => {
            console.log(JSON.stringify(res))
        })
    })
    globaldesigner.navbarelement.appendChild(exportbutton)
}
