class EnumWidget extends Widget{
    
    constructor(options:string[]){
        super()
        this.rootElement = string2html(`<select>
        </select>`)
        for(var option of options){
            this.rootElement.insertAdjacentHTML('beforeend',`<option value="${option}">${option}</option>`)
        }
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.value
    }
    set(val: any) {
        this.inputelement.value = val
    }
}