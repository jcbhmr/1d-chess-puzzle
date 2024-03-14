import { useLocalStorage, useReadLocalStorage } from "usehooks-ts"
import { unreachable } from "./util"

export interface AppSettings {
    colorScheme: "light" | "dark" | "system"
    reducedMotion: "true" | "false" | "system"
    /** range [0,1] */
    volume: number
}