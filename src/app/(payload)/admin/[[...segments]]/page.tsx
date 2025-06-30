/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import { AuthProvider } from '../../../../components/auth/AuthProvider'
import { AuthGuard } from '../../../../components/auth/AuthGuard'
import CMSDashboard from '../../../components/CMSDashboard'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const Page = async ({ params: _params, searchParams: _searchParams }: Args) => {
  return (
    <AuthProvider>
      <AuthGuard>
        <CMSDashboard />
      </AuthGuard>
    </AuthProvider>
  )
}

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Portfolio CMS Dashboard',
    description: 'Content management dashboard for Cura Futuri portfolio'
  }
}

export default Page 