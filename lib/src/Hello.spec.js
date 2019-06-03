import React from 'react'
import { Hello } from './Hello'
import { render } from '@testing-library/react'
import 'jest-dom/extend-expect'

describe('Hello', () => {
  it('should render without prop name', () => {
    const { container, getByText } = render(<Hello />)
    expect(getByText('Hello world!')).toBeInTheDocument()
  })

  it('should render with prop name', () => {
    const { container, getByText } = render(<Hello name="Yvonnick" />)
    expect(getByText('Hello Yvonnick!')).toBeInTheDocument()
  })
})
