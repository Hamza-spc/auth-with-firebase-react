import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import firebase from 'firebase/compat/app'
import { auth } from '../firebase'

export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const currentPasswordRef = useRef()

  const { currentUser, updatePassword, updateEmail } = useAuth()

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    if (promises.length === 0) {
      return setError('No changes detected')
    }

    try {
      setLoading(true)

      // 🔑 Reauthenticate user with current password
      const credential = firebase.auth.EmailAuthProvider.credential(
        currentUser.email,
        currentPasswordRef.current.value
      )
      await auth.currentUser.reauthenticateWithCredential(credential)

      // Apply updates
      await Promise.all(promises)

      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to update account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {currentUser && <div className="mb-2">Current email: {currentUser.email}</div>}

          {error && <Alert variant='danger'>{error}</Alert>}
          {success && <Alert variant='success'>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group id='email' className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>

            <Form.Group id='password' className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type='password'
                ref={passwordRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>

            <Form.Group id='password-confirm' className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type='password'
                ref={passwordConfirmRef}
                placeholder='Leave blank to keep the same'
              />
            </Form.Group>

            <Form.Group id='current-password' className="mb-3">
              <Form.Label>Current Password (required)</Form.Label>
              <Form.Control
                type='password'
                ref={currentPasswordRef}
                required
                placeholder='Enter your current password'
              />
            </Form.Group>

            <Button disabled={loading} type='submit' className='w-100'>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className='w-100 text-center mt-2'>
        <Link to="/">Cancel</Link>
      </div>
    </>
  )
}
