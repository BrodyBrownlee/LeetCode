import { createBrowserRouter } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { SignInPage } from '../features/auth/components/SignInPage'
import { AuthCallback } from '../features/auth/components/AuthCallback'
import { UsernameOnboarding } from '../features/auth/components/UsernameOnboarding'
import { Dashboard } from '../features/stats/components/Dashboard'
import { ProblemList } from '../features/problems/components/ProblemList'
import { ProblemDetail } from '../features/problems/components/ProblemDetail'
import { LogProblemForm } from '../features/problems/components/LogProblemForm'
import { ReviewQueue } from '../features/review/components/ReviewQueue'
import { FriendsPage } from '../features/friends/components/FriendsPage'
import { FriendProfile } from '../features/friends/components/FriendProfile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'problems', element: <ProblemList /> },
      { path: 'problems/new', element: <LogProblemForm /> },
      { path: 'problems/:id', element: <ProblemDetail /> },
      { path: 'review', element: <ReviewQueue /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'friends/:id', element: <FriendProfile /> },
    ],
  },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/welcome', element: <UsernameOnboarding /> },
  { path: '/login', element: <SignInPage /> },
])
