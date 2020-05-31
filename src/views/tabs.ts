class Tabs{

    rootelement:HTMLElement
    tabs:Map<string,HTMLElement> = new Map()
    tabbuttons: HTMLElement
    tabcontainer: HTMLElement
    listviews: ListView[]

    constructor(public designer:Designer,public backrefsAttributes:Attribute[],primarykey:string){
        
        this.rootelement = string2html(`<div style="margin-top:10px; padding:10px; border:1px solid black;">
            <div id="tabbuttons"></div>
            <div id="tabcontainer" style="padding:10px; border:1px solid black; margin:10px 0 0 0;"></div>
        </div>`)
        this.tabbuttons = this.rootelement.querySelector('#tabbuttons')
        this.tabcontainer = this.rootelement.querySelector('#tabcontainer')


        this.listviews = []

        for(let attribute of backrefsAttributes){
            let backrefobject = this.designer.getObjDef(attribute.belongsToObject)
            let name = `${backrefobject.name}-${attribute.name}`
            let button = string2html(`<button style="margin-right:10px;">${name}</button>`)
            this.tabbuttons.appendChild(button)
            let listview = new ListView(designer,backrefobject)
            this.listviews.push(listview)
            let filter = {}
            filter[attribute.name] = primarykey
            listview.setQueryAndReload('createdAt',true,0,0,filter)

            listview.newbuttonelment.removeEventListener('click',listview.newbuttononclick)
            listview.newbuttonelment.addEventListener('click',() => {
                let obj = {}
                obj[attribute.name] = primarykey
                create(backrefobject.name,obj).then(id => {
                    this.designer.router.navigate(`/${backrefobject.name}/${id}`)
                })
            })

            button.addEventListener('click',e => {
                this.loadView(listview)
            })
        }
        this.loadView(this.listviews[0])
    }

    loadView(listview:ListView){
        emptyhtml(this.tabcontainer)
        this.tabcontainer.appendChild(listview.rootelement)
    }
}
