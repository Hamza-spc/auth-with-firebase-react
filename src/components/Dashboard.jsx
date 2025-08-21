import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setError('')
    try {
      await logout()
      navigate('/login')
    } catch {
      setError('Failed to log out')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f0f2f5' }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Card className="bg-white shadow-lg rounded-4 border-0">
          <Card.Body className="p-5">
            <h2 className="text-center mb-4 text-primary">Your Profile</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <div className="mb-4">
              <strong>Email:</strong>
              <p className="text-muted mb-0">{currentUser.email}</p>
            </div>

            <Link 
              to='/update-profile' 
              className='btn btn-primary w-100 mb-3 shadow-sm rounded-pill'
            >
              Update Profile
            </Link>

            <Button 
              variant="outline-danger" 
              onClick={handleLogout} 
              className="w-100 shadow-sm rounded-pill"
            >
              Log Out
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
