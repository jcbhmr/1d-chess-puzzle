export class AstrianChessMinimaxEngine extends EventTarget {
    #debug = false
    constructor() {
        super()
    }
    uci() {
        this.dispatchEvent(new CustomEvent("id", {
            detail: { name: "AstrianChessMinimaxEngine" }
        }))
        this.dispatchEvent(new CustomEvent("id", {
            detail: { author: "Jacob Hummer" }
        }))
        this.dispatchEvent(new Event("uciok"))
    }
    debug(a: "on" | "off") {
        this.#debug = a === "on" ? true : false
    }
    isready() {
        this.dispatchEvent(new Event("readyok"))
    }
    setoption(name: string, value?: string) {
    }
    register(detail: "later" | { name: string } | { code: string }) {
    }
    ucinewgame() {

    }
    position(pos: { fen: string } | "startpos", ...moves: string[]) {
        
    }
    go() {}
    stop() {}
    ponderhit() {}
    quit() {}
}
