import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Splash } from './components/layout/Splash'
import { Checkout } from './pages/Checkout/Checkout'
import { DishPage } from './pages/Dish/Dish'
import { Favorites } from './pages/Favorites/Favorites'
import { Health } from './pages/Health/Health'
import { Home } from './pages/Home/Home'
import { Insights } from './pages/Insights/Insights'
import { NotFound } from './pages/NotFound'
import { OrderSuccess } from './pages/OrderSuccess/OrderSuccess'
import { Orders } from './pages/Orders/Orders'
import { Plans } from './pages/Plans/Plans'
import { Recommendations } from './pages/Recommendations/Recommendations'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="dish/:id" element={<DishPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="plans" element={<Plans />} />
          <Route path="health" element={<Health />} />
          <Route path="health/insights" element={<Insights />} />
          <Route path="health/recommendations" element={<Recommendations />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order/:id" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Splash />
    </>
  )
}
