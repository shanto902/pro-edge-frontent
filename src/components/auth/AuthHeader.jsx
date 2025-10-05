// src/components/common/auth/AuthHeader.jsx
import React from 'react'
import Logo from '../../assets/ProEdgeLogo.png'
import { Link } from 'react-router-dom'
const AuthHeader = ({ title, subtitle }) => {
  return (
    <header className="mb-8">
      <div className="flex justify-center mb-8">
        <Link to="/">
        <img src={Logo} alt="ProEdge Logo" className="max-w-xs w-full bg-[#182B55] p-3" />
        </Link>
      </div>
      <h1 className="text-4xl font-semibold mt-6 mb-4 text-[#182B55]">{title}</h1>
      <p className="text-[#5D6576] text-lg">{subtitle}</p>
    </header>
  )
}

export default AuthHeader
