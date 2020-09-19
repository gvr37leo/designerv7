/// <reference path="./definition.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="../node_modules/utilsx/utils.ts" />
/// <reference path="./views/detailview.ts" />
/// <reference path="./views/ListView.ts" />
/// <reference path="./ajax.ts" />
/// <reference path="./projectutils.ts" />
/// <reference path="./views/table.ts" />
/// <reference path="./router.ts" />
/// <reference path="../node_modules/eventsystemx/EventSystem.ts" />
/// <reference path="./views/contenttree.ts" />
/// <reference path="./views/knotView.ts" />




class Designer{
    propertyUseNameIdentifier = false
    objUsenameIdentifier = false

    detailviews:DetailView[] = []
    listViews:ListView[] = []
    contenttree:ContentTree

    router: Router
    navbarelement: HTMLElement
    viewcontainer: HTMLElement
    contenttreeElement: HTMLElement

    constructor(public definition:AppDef,public rootElement:HTMLElement){

        this.rootElement.insertAdjacentHTML('beforeend',`
            <div>
                <div id="navbar"></div>
                <div style="display:flex;">
                    <div id="contenttree"></div>
                    <div id="viewcontainer"></div>
                </div>
            </div>
        `)
        this.navbarelement = this.rootElement.querySelector('#navbar')
        this.viewcontainer = this.rootElement.querySelector('#viewcontainer')
        this.contenttreeElement = this.rootElement.querySelector('#contenttree')

        this.contenttree = new ContentTree(this)
        this.contenttree.reloadKnots()
        this.contenttreeElement.appendChild(this.contenttree.rootElement)

        for(var obj of this.definition.objdefinitions){
            this.navbarelement.insertAdjacentHTML('beforeend',`<a style="margin:10px;" href="/${obj.name}">${obj.name}</a>`)
        }
        

        this.router = new Router()

        for(var obj of definition.objdefinitions){
            this.detailviews.push(new DetailView(this,obj))
            this.listViews.push(new ListView(this,obj))
        }

        this.router.listen(new RegExp('^/$'), res => {
            var obj = this.definition.objdefinitions[0]
            var listview = this.listViews.find(d => d.objDefinition.name == obj.name)
            this.replaceView(listview)
            listview.mount()
        })
        this.router.listen(new RegExp('^/([a-zA-Z0-9]+)$'), res => {
            var listview = this.listViews.find(d => d.objDefinition.name == res[1])
            this.replaceView(listview)
            listview.mount()
        })
        this.router.listen(new RegExp('^/([a-zA-Z0-9]+)/([a-zA-Z0-9]+)$'), res => {
            var detailview = this.detailviews.find(d => d.definition.name == res[1])
            this.replaceView(detailview)
            detailview.mount(res[2])
        })

        window.addEventListener('popstate',(event) => {
            this.router.trigger(window.location.pathname)
        })

        this.router.trigger(window.location.pathname)

        document.addEventListener('click',(e:any) => {
            if(e.target.tagName == 'A'){
                e.preventDefault()
                var href = e.target.getAttribute('href')
                this.router.navigate(href)
            }
        })
    }

    getListView(objectid: string):ListView {
        return this.listViews.find(lv => lv.objDefinition._id == objectid)
    }

    getDetailView(objectid: string):DetailView {
        return this.detailviews.find(dv => dv.definition._id == objectid)
    }

    replaceView(view){
        emptyhtml(this.viewcontainer)
        this.viewcontainer.appendChild(view.rootelement)
    }

    getAttribute(id:string):Attribute{
        return this.definition.attributes.find(a => a._id == id)
    }

    getObjDef(id:string):ObjDef{
        return this.definition.objdefinitions.find(o => o._id == id)
    }

    getDataTypeDef(id:string):DataTypeDef{
        return this.definition.dataTypes.find(o => o._id == id)
    }
}