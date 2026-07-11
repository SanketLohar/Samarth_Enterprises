import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { getCategories, normalizeProduct } from '../data/parseProducts'
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc, serverTimestamp, deleteDoc, increment, query, where, getDocs, getDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase/config'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [appReady, setAppReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [products, setProducts] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [services, setServices] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const [isTechnician, setIsTechnician] = useState(false)
  // authReady: true once we know both isAuthenticated AND isTechnician are resolved
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null)

      if (user) {
        setIsAuthenticated(true);
        
        try {
          // Direct Query targeting the user email safely
          const techQuery = query(
            collection(db, 'technicians'), 
            where('email', '==', user.email.toLowerCase().trim())
          );
          const querySnapshot = await getDocs(techQuery);

          // CRITICAL: Double validation check
          if (!querySnapshot.empty && querySnapshot.docs.length > 0) {
            console.log(`[SECURITY] Match found in technicians collection. Routing ${user.email} as TECHNICIAN.`);
            setIsTechnician(true);
          } else {
            console.log(`[SECURITY] No match found in technicians collection. Routing ${user.email} as MASTER ADMIN.`);
            setIsTechnician(false);
          }
        } catch (error) {
          console.error("[SECURITY] Role resolution system failed:", error);
          setIsTechnician(false); // Safety fallback to Admin
        } finally {
          setAuthReady(true);
        }
      } else {
        setIsAuthenticated(false);
        setIsTechnician(false);
        setAuthReady(true);
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setProducts(fetched.map(normalizeProduct))
    }, (err) => console.error("products:", err))
    return () => unsubscribe()
  }, [])

  // ── Auth-guarded private collection listeners ──────────────────────────
  // These ONLY open after Firebase confirms a valid authenticated session.
  // When the user logs out (currentUser → null), cleanup tears down all
  // three listeners simultaneously — no permission errors, no memory leaks.
  useEffect(() => {
    if (!currentUser) {
      // Clear stale data on logout so private data doesn't persist in memory
      setEnquiries([])
      setServices([])
      setTechnicians([])
      return
    }

    const unsubEnquiries = onSnapshot(
      collection(db, 'enquiries'),
      (snapshot) => {
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        fetched.sort((a, b) => {
          const da = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
          const db2 = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
          return db2 - da
        })
        setEnquiries(fetched)
      },
      (err) => console.error('Enquiries stream error:', err)
    )

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      },
      (err) => console.error('Services stream error:', err)
    )

    const unsubTechnicians = onSnapshot(
      collection(db, 'technicians'),
      (snapshot) => {
        setTechnicians(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      },
      (err) => console.error('Technicians stream error:', err)
    )

    // Teardown: unsubscribe all three when user logs out or component unmounts
    return () => {
      unsubEnquiries()
      unsubServices()
      unsubTechnicians()
    }
  }, [currentUser])

  const categories = useMemo(() => getCategories(products.filter(p => !p.hidden)), [products])

  useEffect(() => {
    const t = setTimeout(() => setAppReady(true), 1600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (appReady) {
      const t = setTimeout(() => setShowSplash(false), 600)
      return () => clearTimeout(t)
    }
  }, [appReady])

  const updateProduct = useCallback(async (product) => {
    try {
      const { imagePath, imageFallbacks, ...payload } = product
      await setDoc(doc(db, 'products', product.id), payload)
    } catch (e) { console.error(e) }
  }, [])

  const toggleProductVisibility = useCallback(async (product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { hidden: !product.hidden })
    } catch (e) { console.error(e) }
  }, [])

  const updateProductStock = useCallback(async (productId, quantitySold) => {
    try {
      await updateDoc(doc(db, 'products', productId), { stock: increment(-Math.abs(quantitySold)) })
    } catch (e) { console.error("Failed to update stock:", e) }
  }, [])

  const addEnquiry = useCallback(async (enquiry) => {
    try {
      await addDoc(collection(db, 'enquiries'), { ...enquiry, status: 'New', createdAt: serverTimestamp() })
    } catch (e) { console.error(e) }
  }, [])

  const updateEnquiryStatus = useCallback(async (id, status) => {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status })
    } catch (e) { console.error(e) }
  }, [])

  const addService = useCallback(async (serviceData) => {
    try { await addDoc(collection(db, 'services'), serviceData) }
    catch (e) { console.error(e) }
  }, [])

  const updateService = useCallback(async (serviceData) => {
    try {
      const { id, ...data } = serviceData
      await updateDoc(doc(db, 'services', id), data)
    } catch (e) { console.error(e) }
  }, [])

  const deleteService = useCallback(async (id) => {
    try { await deleteDoc(doc(db, 'services', id)) }
    catch (e) { console.error(e) }
  }, [])

  const toggleServiceVisibility = useCallback(async (service) => {
    try { await updateDoc(doc(db, 'services', service.id), { hidden: !service.hidden }) }
    catch (e) { console.error(e) }
  }, [])

  const assignServiceTechnician = useCallback(async (serviceId, technicianId, technicianName) => {
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        assignedTechnicianId: technicianId,
        assignedTechnicianName: technicianName,
        assignedAt: serverTimestamp(),
        status: 'Assigned',
      })
    } catch (e) { console.error(e) }
  }, [])

  const updateServiceStatus = useCallback(async (serviceId, status) => {
    try { await updateDoc(doc(db, 'services', serviceId), { status }) }
    catch (e) { console.error(e) }
  }, [])

  const addTechnician = useCallback(async (techData) => {
    try { await addDoc(collection(db, 'technicians'), { ...techData, createdAt: serverTimestamp() }) }
    catch (e) { console.error(e) }
  }, [])

  const deleteTechnician = useCallback(async (id) => {
    try { await deleteDoc(doc(db, 'technicians', id)) }
    catch (e) { console.error(e) }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      return cred.user // Return the full user object so the caller can use .uid
    } catch (e) {
      console.error(e)
      return null
    }
  }, [])

  const logout = useCallback(async () => {
    try { await signOut(auth) }
    catch (e) { console.error(e) }
  }, [])

  const visibleProducts = useMemo(() => products.filter(p => !p.hidden), [products])

  const value = {
    appReady, showSplash, products, visibleProducts, categories,
    enquiries, services, technicians, currentUser, isAuthenticated,
    isTechnician, authReady,
    addEnquiry, updateEnquiryStatus,
    updateProduct, updateProductStock, toggleProductVisibility,
    addService, updateService, deleteService, toggleServiceVisibility,
    assignServiceTechnician, updateServiceStatus,
    addTechnician, deleteTechnician,
    login, logout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
