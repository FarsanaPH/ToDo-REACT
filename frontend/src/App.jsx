import { ToastContainer } from 'react-toastify'
import './App.css'
import Home from './pages/Home'


function App() {
  return (
    <>
      <Home />
       <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  )
}

export default App
