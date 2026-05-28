import { cookies } from 'next/headers'
import { adminAuth } from './firebase/admin'

export type AuthSession = {
  uid: string
  email: string | undefined
}

export async function getAuthSession(): Promise<AuthSession> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) throw new Error('UNAUTHENTICATED')

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    return { uid: decoded.uid, email: decoded.email }
  } catch {
    throw new Error('INVALID_TOKEN')
  }
}

export async function getAuthSessionOrNull(): Promise<AuthSession | null> {
  try {
    return await getAuthSession()
  } catch {
    return null
  }
}
