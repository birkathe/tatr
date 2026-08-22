import { Navigate, Route, Routes } from 'react-router-dom'
import { useBank } from './store/BankContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
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
import { RatesPage, BranchesPage, ProductsPage, LoansPage, SecurityPage, HelpPage } from './pages/ExtraPages'

export default function App() {
  const { session } = useBank()

  if (!session) {
    return (
      <Routes>
        <Route path="/prihlasenie" element={<Login />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/prihlasenie" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Layout />}>
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
        <Route path="kurzy" element={<RatesPage />} />
        <Route path="pobocky" element={<BranchesPage />} />
        <Route path="produkty" element={<ProductsPage />} />
        <Route path="uvery" element={<LoansPage />} />
        <Route path="bezpecnost" element={<SecurityPage />} />
        <Route path="pomoc" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
