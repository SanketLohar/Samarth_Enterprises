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
  const [productEnquiries, setProductEnquiries] = useState([])
  const [services, setServices] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [consultants, setConsultants] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const [isTechnician, setIsTechnician] = useState(false)
  // authReady: true once we know both isAuthenticated AND isTechnician are resolved
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const techSession = localStorage.getItem('techSession')
    if (techSession) {
      try {
        const user = JSON.parse(techSession)
        setCurrentUser(user)
        setIsAuthenticated(true)
        setIsTechnician(true)
        setAuthReady(true)
        return // Skip Firebase auth check if valid local tech session exists
      } catch (e) {
        localStorage.removeItem('techSession')
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
        setIsTechnician(false) // Firebase auth is strictly for admins now
        setAuthReady(true)
      } else {
        // Double check local storage just in case
        if (!localStorage.getItem('techSession')) {
          setCurrentUser(null)
          setIsAuthenticated(false)
          setIsTechnician(false)
          setAuthReady(true)
        }
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
      setProductEnquiries([])
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

    const unsubProductEnquiries = onSnapshot(
      collection(db, 'product_inquiries'),
      (snapshot) => {
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        fetched.sort((a, b) => {
          const da = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
          const db2 = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
          return db2 - da
        })
        setProductEnquiries(fetched)
      },
      (err) => console.error('Product Enquiries stream error:', err)
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

    const unsubConsultants = onSnapshot(
      collection(db, 'consultants'),
      (snapshot) => {
        setConsultants(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      },
      (err) => console.error('Consultants stream error:', err)
    )

    // Teardown: unsubscribe all when user logs out or component unmounts
    return () => {
      unsubEnquiries()
      unsubProductEnquiries()
      unsubServices()
      unsubTechnicians()
      unsubConsultants()
    }
  }, [currentUser])

  // ── Role-Guarded Notification Listener ───────────────────────────────────
  useEffect(() => {
    // Only initialize the real-time notification stream if an admin is logged in
    if (!currentUser || isTechnician) {
      setNotifications([]); // Clear any lingering notifications state for non-admins
      return;
    }

    const unsubNotifications = onSnapshot(
      query(collection(db, 'notifications')), // Default ordering handled client side if needed
      (snapshot) => {
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        fetched.sort((a, b) => {
          const da = a.timestamp?.toDate?.() || new Date(a.timestamp || 0)
          const db2 = b.timestamp?.toDate?.() || new Date(b.timestamp || 0)
          return db2 - da
        })
        setNotifications(fetched)
      },
      (err) => console.error('Notifications stream error:', err)
    )

    return () => unsubNotifications()
  }, [currentUser, isTechnician])

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

  const addEnquiry = useCallback(async (enquiry, collectionName = 'enquiries') => {
    try {
      await addDoc(collection(db, collectionName), { ...enquiry, status: 'New', createdAt: serverTimestamp() })
      
      // Secondary hook: push to global admin notifications stream
      await addDoc(collection(db, 'notifications'), {
        type: 'new_inquiry',
        title: 'New Customer Enquiry',
        message: `A new inquiry has been submitted by ${enquiry.name} for ${enquiry.productName || enquiry.serviceType || 'Product Consultation'}.`,
        clientPhone: enquiry.phone,
        status: 'unread',
        timestamp: serverTimestamp()
      })
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

  const addNotification = useCallback(async (payload) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...payload,
        status: 'unread',
        timestamp: serverTimestamp()
      })
    } catch (e) { console.error('Failed to add notification:', e) }
  }, [])

  const markNotificationsRead = useCallback(async () => {
    try {
      const unread = notifications.filter(n => n.status === 'unread')
      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), { status: 'read' })
      }
    } catch (e) { console.error(e) }
  }, [notifications])

  const markNotificationRead = useCallback(async (id) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { status: 'read' })
    } catch (e) { console.error(e) }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      // Step A: Check Firestore for Technician Custom Login first
      let techSnapshot = null;
      try {
        const techQuery = query(
          collection(db, 'technicians'),
          where('email', '==', email.toLowerCase().trim())
        );
        techSnapshot = await getDocs(techQuery);
      } catch (err) {
        console.warn('Skipping technician lookup:', err.message);
      }
      
      if (techSnapshot && !techSnapshot.empty) {
        const techDoc = techSnapshot.docs[0];
        const techData = techDoc.data();
        
        // Step B: Verify Password & Status
        if (techData.password === password) {
          if (techData.active === false || techData.status === 'Inactive') {
            throw new Error('Your technician account is inactive. Please contact your administrator.');
          }
          
          const userObj = { uid: techDoc.id, email: techData.email, role: 'technician' };
          
          // Save session
          localStorage.setItem('techSession', JSON.stringify(userObj));
          
          setCurrentUser(userObj);
          setIsTechnician(true);
          setIsAuthenticated(true);
          return userObj;
        } else {
          throw new Error('Invalid technician password.');
        }
      }

      // Step A.5: Check Firestore for Consultant Login if not found in technicians
      let consultantSnapshot = null;
      try {
        const consultantQuery = query(
          collection(db, 'consultants'),
          where('email', '==', email.toLowerCase().trim())
        );
        consultantSnapshot = await getDocs(consultantQuery);
      } catch (err) {
        console.warn('Skipping consultant lookup:', err.message);
      }

      if (consultantSnapshot && !consultantSnapshot.empty) {
        const consultantDoc = consultantSnapshot.docs[0];
        const consultantData = consultantDoc.data();
        
        if (consultantData.password === password) {
          if (consultantData.active === false || consultantData.status === 'Inactive') {
            throw new Error('Your consultant account is inactive. Please contact your administrator.');
          }
          
          const userObj = { uid: consultantDoc.id, email: consultantData.email, role: 'consultant' };
          
          // Save session
          localStorage.setItem('techSession', JSON.stringify(userObj)); // Use same session token block
          
          setCurrentUser(userObj);
          setIsTechnician(true); // Using true routes them securely to HelperDashboard, where role differentiates UI
          setIsAuthenticated(true);
          return userObj;
        } else {
          throw new Error('Invalid consultant password.');
        }
      }

      // Step C: Fallback to Firebase Auth for Admins
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      setCurrentUser(cred.user);
      setIsTechnician(false);
      setIsAuthenticated(true);
      return cred.user;

    } catch (e) {
      console.error('Login error:', e);
      throw e; // Throw so Login.jsx can catch and show error
    }
  }, []);

  const logout = useCallback(async () => {
    try { 
      // 1. Terminate Firebase Auth tracking token
      await signOut(auth);
      
      // 2. Wipe all local security variables completely
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsTechnician(false);
      
      // 3. Purge browser session keys to completely reset client memory
      localStorage.clear();
      sessionStorage.clear();
      
      // 4. Force a clean, history-replacing redirect straight to the public login root
      window.location.replace('/login');
    } catch (error) {
      console.error("Logout execution failed:", error);
    }
  }, [])

  const visibleProducts = useMemo(() => products.filter(p => !p.hidden), [products])

  const value = {
    appReady, showSplash, products, visibleProducts, categories,
    enquiries, productEnquiries, services, technicians, consultants, currentUser, isAuthenticated,
    isTechnician, authReady,
    addEnquiry, updateEnquiryStatus,
    updateProduct, updateProductStock, toggleProductVisibility,
    addService, updateService, deleteService, toggleServiceVisibility,
    assignServiceTechnician, updateServiceStatus,
    addTechnician, deleteTechnician,
    notifications, addNotification, markNotificationsRead, markNotificationRead,
    login, logout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
