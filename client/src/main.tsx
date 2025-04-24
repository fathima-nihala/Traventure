import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter as Router } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
     <Router>
    <SnackbarProvider autoHideDuration={2000} preventDuplicate dense    >
    <App />
    </SnackbarProvider>
    </Router>
    </Provider>
  </StrictMode>,
)
