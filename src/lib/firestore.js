import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== PRODUCTS ====================

export async function getProducts(filters = {}) {
  let q = collection(db, 'products');
  const constraints = [];

  if (filters.category && filters.category !== 'all') {
    constraints.push(where('category', '==', filters.category));
  }

  if (filters.inStock) {
    constraints.push(where('inStock', '==', true));
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        constraints.push(orderBy('price', 'asc'));
        break;
      case 'price-desc':
        constraints.push(orderBy('price', 'desc'));
        break;
      case 'newest':
        constraints.push(orderBy('createdAt', 'desc'));
        break;
      default:
        constraints.push(orderBy('featured', 'desc'));
    }
  }

  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }

  q = query(q, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, 'products'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function getProductById(id) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function addProduct(productData) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateProduct(id, productData) {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'products', id));
}

// ==================== ORDERS ====================

export async function createOrder(orderData) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getOrders() {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateOrderStatus(id, status) {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
}

// ==================== BLOG POSTS ====================

export async function getBlogPosts() {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getBlogPostBySlug(slug) {
  const q = query(collection(db, 'posts'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

export async function addBlogPost(postData) {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// ==================== NEWSLETTER ====================

export async function addSubscriber(email) {
  const docRef = await addDoc(collection(db, 'newsletter'), {
    email,
    subscribedAt: new Date().toISOString(),
  });
  return docRef.id;
}

// ==================== CONTACT ====================

export async function submitContact(contactData) {
  const docRef = await addDoc(collection(db, 'contacts'), {
    ...contactData,
    createdAt: new Date().toISOString(),
    read: false,
  });
  return docRef.id;
}

// ==================== REAL-TIME LISTENER ====================

export function onProductsSnapshot(callback) {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(products);
  });
}
