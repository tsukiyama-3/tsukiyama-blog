export default defineEventHandler((event) => {
  const { basicAuth } = useRuntimeConfig()

  // ローカルでは無視する
  if (import.meta.dev) {
    return
  }

  // allowedRoutes に指定されていればスキップする
  if (basicAuth.allowedRoutes?.some((route: string) => {
    const regex = new RegExp(route)

    return regex.test(event.node.req.url || '')
  })) {
    return
  }

  // 検証用に /basic-auth 以外はスキップする
  if (!/^\/basic-auth/.test(event.node.req.url || '')) {
    return
  }

  let authenticated = false

  // Authorizationヘッダーから認証情報を取得する
  const credentials = event.node.req.headers.authorization?.split(' ')[1]

  if (credentials) {
    const [username, password] = Buffer.from(credentials, 'base64').toString('utf-8').split(':')

    authenticated = username === basicAuth.username && password === basicAuth.password

    if (authenticated) return
  }

  event.node.res.statusCode = 401
  event.node.res.setHeader(
    'WWW-Authenticate',
    'Basic realm="Secure Area", charset="UTF-8"',
  )
  event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  event.node.res.end('Access denied')
})
