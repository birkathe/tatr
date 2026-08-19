import { Navigate, Route, Routes } from 'react-router-dom'
import { useBank } from './store/BankContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Accounts from './pages/Accounts'
import Payments from './pages/Payments'
import Cards from './pages/Cards'
import Deposits from './pages/Deposits'
import Spending from './pages/Spending'
import Recipients from './pages/Recipients'
import Documents from './pages/Documents'
import Settings from './pages/Settings'
import Messages from './pages/Messages'

function Guard({ children }) {
  const { session } = useBank()
  if (!session) return <Navigate to="/prihlasenie" replace />
  return children
}

export default function App() {
  const { session } = useBank()
  return (
    <Routes>
      <Route path="/prihlasenie" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <Guard>
            <Layout />
          </Guard>
        }
      >
        <Route index element={<Overview />} />
        <Route path="ucty" element={<Accounts />} />
        <Route path="ucty/:id" element={<Accounts />} />
        <Route path="platby" element={<Payments />} />
        <Route path="karty" element={<Cards />} />
        <Route path="vklady" element={<Deposits />} />
        <Route path="vydavky" element={<Spending />} />
        <Route path="prijemcovia" element={<Recipients />} />
        <Route path="dokumenty" element={<Documents />} />
        <Route path="nastavenia" element={<Settings />} />
        <Route path="spravy" element={<Messages />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
