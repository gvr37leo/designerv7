class NumberWidget extends Widget{
    constructor(){
        super()
        this.rootElement = string2html(`<input type="number" />`)
        this.inputelement = this.rootElement as HTMLInputElement
    }
    get() {
        return this.inputelement.value
    }
    set(val: any) {
        this.inputelement.value = val
    }
}