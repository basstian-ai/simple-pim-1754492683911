import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FailedPayloadPreview from '../components/FailedPayloadPreview'

describe('FailedPayloadPreview', () => {
  const sample = 'Email: bob@acme.local\nSSN: 987-65-4321\nToken: superlongtokenvalue1234567890'

  it('renders redacted preview by default', () => {
    render(<FailedPayloadPreview payload={sample} visible={true} onClose={() => {}} />)
    const pre = screen.getByTestId('payload-preview')
    expect(pre).toBeInTheDocument()
    expect(pre).toHaveTextContent('[REDACTED-EMAIL]')
    expect(pre).toHaveTextContent('[REDACTED-SSN]')
    expect(pre).toHaveTextContent('[REDACTED-TOKEN]')
  })

  it('copy button calls clipboard.writeText when available', async () => {
    const writeMock = jest.fn().mockResolvedValue(undefined)
    // @ts-ignore - attach mock
    navigator.clipboard = { writeText: writeMock }

    render(<FailedPayloadPreview payload={sample} visible={true} onClose={() => {}} />)
    const copyBtn = screen.getByRole('button', { name: /copy-payload/i })
    fireEvent.click(copyBtn)
    // allow promise microtask
    await Promise.resolve()
    expect(writeMock).toHaveBeenCalled()
  })

  it('download button triggers anchor click', () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click')
    render(<FailedPayloadPreview payload={sample} visible={true} onClose={() => {}} />)
    const dlBtn = screen.getByRole('button', { name: /download-payload/i })
    fireEvent.click(dlBtn)
    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  it('close button calls onClose', () => {
    const onClose = jest.fn()
    render(<FailedPayloadPreview payload={sample} visible={true} onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })
})
