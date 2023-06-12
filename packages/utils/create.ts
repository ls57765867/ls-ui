

function createBEM(name:string){
    function b(){

    }
    return {
        b
    }
}

function createNamespace(name:string){
    const prefixName = `ls-${name}`
    return createBEM(prefixName)
}