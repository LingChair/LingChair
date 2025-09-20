export default function useAsyncEffect(func: Function, deps?: React.DependencyList) {
    React.useEffect(() => {
        ;(async () => await func())
    }, deps)
}
