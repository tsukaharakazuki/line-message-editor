import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import MessageEditorPage from './pages/MessageEditorPage'
import RichMenuListPage from './pages/RichMenuListPage'
import RichMenuFormPage from './pages/RichMenuFormPage'

export default function App() {
  return (
    <BrowserRouter basename="/line-message-editor/">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/messages" replace />} />
          <Route path="messages" element={<MessageEditorPage />} />
          <Route path="rich-menus" element={<RichMenuListPage />} />
          <Route path="rich-menus/new" element={<RichMenuFormPage />} />
          <Route path="rich-menus/:id/edit" element={<RichMenuFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
