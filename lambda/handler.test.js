const { S3Client } = require('@aws-sdk/client-s3')

const { record } = require('./handler')

let s3Send

beforeEach(() => {
  process.env.STAGE = 'test'
  s3Send = vi.spyOn(S3Client.prototype, 'send').mockResolvedValue({})
})

const call = (body) => record({ body })

it('rejects missing payload', async () => {
  expect(await call(undefined)).toEqual({ statusCode: 400, body: JSON.stringify({ message: 'Missing payload' }) })
  expect(s3Send).not.toHaveBeenCalled()
})

it('rejects non-JSON payload', async () => {
  expect((await call('not json')).statusCode).toBe(400)
})

it('rejects payload missing fields', async () => {
  expect((await call(JSON.stringify({ project: 'p' }))).statusCode).toBe(400)
  expect((await call(JSON.stringify({ project: 'p', streamId: 's' }))).statusCode).toBe(400)
})

it('rejects invalid project/streamId names', async () => {
  expect((await call(JSON.stringify({ project: '../evil', streamId: 's', data: {} }))).statusCode).toBe(400)
  expect((await call(JSON.stringify({ project: 'p', streamId: 'a/b', data: {} }))).statusCode).toBe(400)
})

it('stores valid events in S3 and returns 204', async () => {
  const res = await call(JSON.stringify({ project: 'my-site', streamId: 'pageviews', data: { path: '/' } }))
  expect(res).toEqual({ statusCode: 204 })
  expect(s3Send).toHaveBeenCalledTimes(1)
  const command = s3Send.mock.calls[0][0]
  expect(command.input.Bucket).toBe('domdomegg-analytics-lambda-test')
  expect(command.input.Key).toMatch(/^my-site\/pageviews\/.*\.json$/)
  expect(command.input.Body).toBe(JSON.stringify({ path: '/' }))
})

it('returns 503 when S3 fails', async () => {
  s3Send.mockRejectedValue(new Error('boom'))
  const res = await call(JSON.stringify({ project: 'p', streamId: 's', data: {} }))
  expect(res.statusCode).toBe(503)
})
