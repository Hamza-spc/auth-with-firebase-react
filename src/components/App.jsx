import { Container } from "react-bootstrap"
import Signup from "./Signup"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"

function App() {

  return (
    <>
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: '100vh'}}>
          <div className="w-100" style={{maxWidth: '400px'}}>
              <BrowserRouter>
                  <Routes>
                    <Route path="/" element={
                      <PrivateRoute>
                        <Dashboard/>
                      </PrivateRoute>
                      }>
                    </Route>
                    <Route path="/update-profile" element={
                      <PrivateRoute>
                        <UpdateProfile/>
                      </PrivateRoute>
                      }>
                    </Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                  </Routes>
              </BrowserRouter>
          </div>
      </Container>

    </>
  )
}

export default App
