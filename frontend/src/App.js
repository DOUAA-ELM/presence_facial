import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import Navbar from 'react-bootstrap/Navbar'
import Badge from 'react-bootstrap/Badge'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import { useContext, useState } from 'react'
import { Store } from './Store'
import CartScreen from './screens/CartScreen'
import SigninScreen from './screens/SigninScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import SignupScreen from './screens/SignupScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import SearchBox from './components/SearchBox'
import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './screens/ProfileScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import Attendance from './Attendance'

// 👉 Importation de Face Signin
import FaceSigninScreen from './screens/FaceSigninScreen'

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    localStorage.removeItem('cartItems')
    window.location.href = '/signin'
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar className="custom-navbar" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>SCENT</Navbar.Brand>
              </LinkContainer>
              <SearchBox />
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  PANIER
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="success">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>

                <Link to="/attendance" className="nav-link">
                  Présence
                </Link>

                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Modifier Profil</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Déconnexion
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Se connecter
                  </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Produits</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/admin/products" element={<ProductListScreen />} />
              <Route
                path="/admin/product/:id"
                element={<ProductEditScreen />}
              />
              <Route path="/admin/users" element={<UserListScreen />} />
              <Route path="/admin/user/:id" element={<UserEditScreen />} />
              <Route path="/attendance" element={<Attendance />} />

              {/* ✅ Nouvelle route pour connexion faciale */}
              <Route path="/face-signin" element={<FaceSigninScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
