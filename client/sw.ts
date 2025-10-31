interface FetchEvent extends Event {
    waitUntil: (p: Promise<unknown | void>) => void
    request: Request
    respondWith: (r: Response | Promise<Response>) => void
}

// 上传文件的代理与缓存
self.addEventListener("fetch", (e) => {
    const event = e as FetchEvent
    if (event.request.method != "GET" || event.request.url.indexOf("/uploaded_files/") == -1) return

    event.respondWith(
        (async () => {
            const cache = await caches.open("LingChair-UploadedFile-Cache")
            const cachedResponse = await cache.match(event.request)
            if (cachedResponse) {
                event.waitUntil(cache.add(event.request))
                return cachedResponse
            }
            return fetch({
                ...event.request,
                headers: {
                    ...event.request.headers,
                    // 目前还不能获取 token
                    // localsotrage 在这里不可用
                }
            })
        })()
    )
})
