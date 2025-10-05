import { Outlet } from 'react-router-dom'
import Header from '../components/common/header/Header'
import Footer from '../components/common/footer/Footer'

const Root = () => {
  return (
    <>
    <Header />
      <main>
        <Outlet />
      </main>
    <Footer />
    </>
  )
}

export default Root
