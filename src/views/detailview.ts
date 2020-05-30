/// <reference path="../widgets/booleanwidget.ts" />
/// <reference path="../widgets/datewidget.ts" />
/// <reference path="../widgets/idwidget.ts" />
/// <reference path="../widgets/numberwidget.ts" />
/// <reference path="../widgets/rangewidget.ts" />
/// <reference path="../widgets/textwidget.ts" />
/// <reference path="../widgets/enumwidget.ts" />
/// <reference path="../widgets/pointerwidget.ts" />
/// <reference path="../widgets/widget.ts" />
/// <reference path="tabs.ts" />



class DetailView{

    rootelement:HTMLElement
    widgets:Map<string,Widget> = new Map<string,Widget>()
    tabs:Tabs
    tables:Table<any>[] = []
    duplicatebuttonElement: HTMLElement
    savebuttonElement: HTMLElement
    deletebuttonElement: HTMLElement
    upbuttonElement: HTMLElement
    widgetcontainer: HTMLElement
    tabscontainer: HTMLElement
    attributes: Attribute[]

    constructor(public designer:Designer,public definition:ObjDef){

        //(duplicate)
        //save
        //delete
        //up

        //create widgets for attributes
        //create tabs
        //fill tabs with tables

        var idattribute = this.designer.definition.attributes.find(a => a.belongsToObject == this.definition._id && a.dataType==DataType.id && a.name == "_id")
        this.rootelement = string2html(`
            <div>
                <h1>${definition.name}</h1>

                <div style="margin:10px;">
                    <button id="duplicatebutton">duplicate</button>
                    <button id="savebutton">save</button>
                    <button id="deletebutton">delete</button>
                    <button id="upbutton">up</button>
                </div>
                <div id="widgetcontainer"></div>
                <div id="tabscontainer"></div>
            </div>
        `)

        this.duplicatebuttonElement = this.rootelement.querySelector('#duplicatebutton')
        this.savebuttonElement = this.rootelement.querySelector('#savebutton')
        this.deletebuttonElement = this.rootelement.querySelector('#deletebutton')
        this.upbuttonElement = this.rootelement.querySelector('#upbutton')
        this.widgetcontainer = this.rootelement.querySelector('#widgetcontainer')
        this.tabscontainer = this.rootelement.querySelector('#tabscontainer')

        this.duplicatebuttonElement.addEventListener('click',() => {

        })
        this.savebuttonElement.addEventListener('click',() => {
            var data = this.getObjectData()
            update(this.definition.name,data._id,data)
        })
        this.deletebuttonElement.addEventListener('click',() => {
            del(this.definition.name,this.widgets.get(idattribute._id).get()).then(() => {
                this.designer.router.navigate(`/${this.definition.name}`)
            })
        })
        this.upbuttonElement.addEventListener('click',() => {
            this.designer.router.navigate(`/${this.definition.name}`)
        })

        this.attributes = this.designer.definition.attributes.filter(a => a.belongsToObject == this.definition._id)
        for(var attribute of this.attributes){
            var widget = createWidget(attribute.dataType,attribute,designer)
            this.widgets.set(attribute._id,widget)
            var widgethull = string2html(`
                <div>
                    <label>
                        ${attribute.name}
                        <div id="asd"/>
                    </label>
                </div>
            `)
            widgethull.querySelector('#asd').appendChild(widget.rootElement)
            this.widgetcontainer.appendChild(widgethull)
        }

        
    }

    mount(id:string){
        get(this.definition.name,id).then(val => {

            for(let attribute of this.attributes){
                let widget = this.widgets.get(attribute._id)
                if(attribute.dataType == DataType.pointer){
                    let pointerwidget = widget as PointerWidget
                    pointerwidget.fillOptions().then(() => {
                        widget.set(val[attribute.name])
                    })
                }else{
                    widget.set(val[attribute.name])
                }
            }
        })

        var backrefs = this.designer.definition.attributes.filter(a => a.pointsToObject == this.definition._id)
        emptyhtml(this.tabscontainer)
        if(backrefs.length > 0){
            this.tabs = new Tabs(this.designer,backrefs, id)
            this.tabscontainer.appendChild(this.tabs.rootelement)
        }
        
    }

    getAttributeWidget(attributeid:string){
        this.widgets.get(attributeid)
    }

    getTable(attributeid:string){

    }

    getBackRefs(objectid:string){
        
    }

    getObjectData():any{
        var res = {}
        for(var attribute of this.attributes){
            res[attribute.name] = this.widgets.get(attribute._id).get()
        }
        return res
    }
}