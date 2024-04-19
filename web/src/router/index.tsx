import { createHashRouter, redirect } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

const DomainsView = lazy(() => import('../views/DomainsView'))
const RecordsView = lazy(() => import('../views/RecordsView'))

const router = createHashRouter([
    {
        path: '/',
        loader: async () => {
            return redirect('/domains')
        },
    },
    {
        path: '/domains',
        id: 'domains',
        element: <Suspense fallback={<Spin size='large' />}><DomainsView /></Suspense>
    },
    {
        path: '/records/:domain',
        id: 'records',
        loader: args => args.params,
        element: <Suspense fallback={<Spin size='large' />}><RecordsView /></Suspense>
    }
])

export default router