import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout.jsx'
import CasesPage from './pages/Cases.jsx'
import ChatPage from './pages/Chat.jsx'
import CreateCasePage from './pages/CreateCase.jsx'
import GeneratorPage from './pages/Generator.jsx'
import ResearchPage from './pages/Research.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/cases" replace />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/createcase" element={<CreateCasePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </Layout>
  )
}
