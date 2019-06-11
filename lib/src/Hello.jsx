import React, { useState } from 'react'
import tinycolor from 'tinycolor2'

Hello.defaultProps = {
  name: 'world'
}

export function Hello({ name }) {
  const [isUppercase, setUppercase] = useState()
  return (
    <p style={{ textTransform: isUppercase ? 'uppercase' : 'lowercase', color: tinycolor('red') }}>
      Hello {name}!
       <button onClick={() => setUppercase(!isUppercase)}>Uppercase</button>
    </p>
  )
}
