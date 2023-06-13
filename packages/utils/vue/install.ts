import {Plugin} from "vue";

type SFCWithInstall<T> = T & Plugin
export const withInstall =<T,E extends Record<string, any>> (main:T,extra:E ) => {
    (main as SFCWithInstall<T>).install = (app)=>{
        for(const com of [main,...Object.values(extra || {})]){
            app.component(com.name,com)
        }
    }
    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            ;(main as any)[key] = comp
        }
    }
    return main as SFCWithInstall<T> & E
}


export const withNoopInstall = <T>(component: T) => {
    ;(component as SFCWithInstall<T>).install = NOOP

    return component as SFCWithInstall<T>
}
