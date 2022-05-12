import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate= new useNavigate()
  localStorage.clear()
      document.location.href = "/";

  return (
    <></>
  )
}

export default Logout