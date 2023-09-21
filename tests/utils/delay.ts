export default function delay(ms: number) {
    return new Promise<void>((resolve, rejet) => setTimeout(() => { resolve() }, ms))
}