export default interface checkInterface<T> {
    (obj: any): obj is T;
}
