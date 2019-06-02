import React, { useState } from 'react'

Hello.defaultProps = {
  name: 'world'
}

export function Hello({ name }) {
  const [isUppercase, setUppercase] = useState()
  return (
    <p style={{ textTransform: isUppercase ? 'uppercase' : 'lowercase' }}>
      Hello {name}!
       <button onClick={() => setUppercase(!isUppercase)}>Uppercase</button>
    </p>
  )
}
