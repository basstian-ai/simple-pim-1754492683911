import { redactPayload, DEFAULT_REDACTION_RULES } from '../utils/redact'

describe('redactPayload', () => {
  it('redacts emails, ssns and tokens by default', () => {
    const input = `Contact: alice@example.com\nSSN: 123-45-6789\nToken: abcdef0123456789ABCDEFghijklmnop` // token-like >20
    const out = redactPayload(input)
    expect(out).toContain('[REDACTED-EMAIL]')
    expect(out).toContain('[REDACTED-SSN]')
    expect(out).toContain('[REDACTED-TOKEN]')
  })

  it('respects custom rules', () => {
    const rules = [
      { name: 'foo', regex: /foo/g, replacement: '[X]' }
    ]
    const out = redactPayload('foo bar baz', { rules })
    expect(out).toBe('[X] bar baz')
  })

  it('truncates long payloads to maxBytes', () => {
    const long = 'a'.repeat(20000)
    const out = redactPayload(long, { maxBytes: 1024 })
    expect(out.endsWith('\n...truncated...')).toBe(true)
    expect(out.length).toBeLessThan(long.length)
  })

  it('does not throw on empty string', () => {
    expect(redactPayload('')).toBe('')
  })
})
