import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Apply from './pages/Apply'
import Dashboard from './pages/Dashboard'
import MyLoans from './pages/MyLoans'
import PrivateRoute from './components/PrivateRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/apply' element={<PrivateRoute roles={['borrower']}><Apply /></PrivateRoute>} />
                <Route path='/dashboard' element={<PrivateRoute roles={['admin','sales','sanction','disbursement','collection']}><Dashboard /></PrivateRoute>} />
                <Route path='/my-loans' element={<PrivateRoute roles={['borrower']}><MyLoans /></PrivateRoute>} />
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App