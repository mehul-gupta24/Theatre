import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MoviesDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/layout'
import Dashboard from './pages/admin/dashboard'
import AddShows from './pages/admin/addShows'
import ListBookings from './pages/admin/listBookings'
import ListShows from './pages/admin/listShows'
import { useAppContext } from './context/appContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const {user, show} = useAppContext()
  return (
    <>
      <Toaster/>
      {!isAdminRoute && <NavBar/>}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies" element={<Movies/>} />
        <Route path="/movies/:id" element={<MoviesDetails/>} />
        <Route path="/movies/:id/:date" element={<SeatLayout/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/favourite" element={<Favourite/>} />
        <Route path="/loading/:nextUrl" element={<Loading/>} />
        <Route path="/admin/*" element={user ? <Layout/> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>} />
          <Route path="list-shows" element={<ListShows/>} />
          <Route path="list-bookings" element={<ListBookings/>} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App