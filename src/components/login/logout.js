import React from 'react'

const Logout = () => {
    localStorage.clear()
    document.location.href = "/"
  return (
    <></>
  )
}

export default Logout