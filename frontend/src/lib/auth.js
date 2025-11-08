import { auth, db, setAuthPersistence } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'

export async function signupWithEmail({ email, password, role, displayName, extra = {} }) {
  await setAuthPersistence(true)
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) await updateProfile(cred.user, { displayName })
  await setDoc(
    doc(db, 'users', cred.user.uid),
    {
      uid: cred.user.uid,
      email: cred.user.email,
      role: role || 'user',
      displayName: displayName || '',
      createdAt: serverTimestamp(),
      ...extra,
    },
    { merge: true },
  )
  return cred.user
}

export async function loginWithEmail({ email, password, remember }) {
  await setAuthPersistence(remember)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const profileSnap = await getDoc(doc(db, 'users', cred.user.uid))
  return { user: cred.user, profile: profileSnap.exists() ? profileSnap.data() : null }
}

// ✅ renamed and exported for clarity & consistency
export async function logoutUser() {
  return await signOut(auth)
}
