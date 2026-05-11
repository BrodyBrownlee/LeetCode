import { RouterProvider } from 'react-router'
import { Providers } from './app/providers'
import { router } from './app/routes'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
