export function throw_(error: any): never {
    throw error
}

export function unreachable(): never {
    throw new DOMException("unreachable", "InvalidStateError")
}