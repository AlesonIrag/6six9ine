// Firestore REST API Helper
// This uses direct HTTP calls instead of SDK to avoid "offline" issues

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "six9ine-ec11e";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCG7qYZaAPyP2GAqyX3ZmG5eg49opBGc6o";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

console.log('🔥 [Firestore REST] Initialized');
console.log('📋 [Firestore REST] Project ID:', FIREBASE_PROJECT_ID);
console.log('🌐 [Firestore REST] Base URL:', FIRESTORE_BASE_URL);

// Helper to convert JavaScript object to Firestore format
function toFirestoreValue(obj) {
  if (obj === null || obj === undefined) {
    return { nullValue: null };
  }
  
  if (Array.isArray(obj)) {
    return {
      arrayValue: {
        values: obj.map(item => toFirestoreValue(item))
      }
    };
  }
  
  if (typeof obj === 'object') {
    const fields = {};
    for (const [key, value] of Object.entries(obj)) {
      fields[key] = toFirestoreValue(value);
    }
    return { mapValue: { fields } };
  }
  
  if (typeof obj === 'string') {
    return { stringValue: obj };
  }
  
  if (typeof obj === 'number') {
    return Number.isInteger(obj) 
      ? { integerValue: obj.toString() }
      : { doubleValue: obj };
  }
  
  if (typeof obj === 'boolean') {
    return { booleanValue: obj };
  }
  
  return { stringValue: String(obj) };
}

// Helper to convert Firestore format to JavaScript object
function fromFirestoreValue(value) {
  if (!value) return null;
  
  if (value.nullValue !== undefined) return null;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.stringValue !== undefined) return value.stringValue;
  
  if (value.arrayValue) {
    return value.arrayValue.values?.map(v => fromFirestoreValue(v)) || [];
  }
  
  if (value.mapValue) {
    const obj = {};
    for (const [key, val] of Object.entries(value.mapValue.fields || {})) {
      obj[key] = fromFirestoreValue(val);
    }
    return obj;
  }
  
  return null;
}

// Get a document
export async function getDocument(collection, documentId) {
  const url = `${FIRESTORE_BASE_URL}/${collection}/${documentId}?key=${FIREBASE_API_KEY}`;
  
  console.log(`📥 [Firestore REST] GET ${collection}/${documentId}`);
  
  const response = await fetch(url);
  
  if (response.status === 404) {
    console.log(`📦 [Firestore REST] Document not found: ${collection}/${documentId}`);
    return null;
  }
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ [Firestore REST] GET failed:`, error);
    throw new Error(`Failed to get document: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  console.log(`✅ [Firestore REST] GET successful`);
  
  // Convert Firestore format to JavaScript object
  if (data.fields) {
    const result = {};
    for (const [key, value] of Object.entries(data.fields)) {
      result[key] = fromFirestoreValue(value);
    }
    return result;
  }
  
  return null;
}

// Set/Update a document
export async function setDocument(collection, documentId, data) {
  const url = `${FIRESTORE_BASE_URL}/${collection}/${documentId}?key=${FIREBASE_API_KEY}`;
  
  console.log(`📤 [Firestore REST] SET ${collection}/${documentId}`);
  console.log(`📦 [Firestore REST] Data keys:`, Object.keys(data));
  
  // Convert JavaScript object to Firestore format
  const firestoreData = {
    fields: {}
  };
  
  for (const [key, value] of Object.entries(data)) {
    firestoreData.fields[key] = toFirestoreValue(value);
  }
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(firestoreData)
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ [Firestore REST] SET failed:`, error);
    throw new Error(`Failed to set document: ${response.status} ${error}`);
  }
  
  console.log(`✅ [Firestore REST] SET successful`);
  return true;
}

// Create a document in a collection
export async function addDocument(collection, data) {
  const url = `${FIRESTORE_BASE_URL}/${collection}?key=${FIREBASE_API_KEY}`;
  
  console.log(`📤 [Firestore REST] ADD to ${collection}`);
  
  // Convert JavaScript object to Firestore format
  const firestoreData = {
    fields: {}
  };
  
  for (const [key, value] of Object.entries(data)) {
    firestoreData.fields[key] = toFirestoreValue(value);
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(firestoreData)
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ [Firestore REST] ADD failed:`, error);
    throw new Error(`Failed to add document: ${response.status} ${error}`);
  }
  
  const result = await response.json();
  console.log(`✅ [Firestore REST] ADD successful`);
  
  // Extract document ID from the response
  const docId = result.name.split('/').pop();
  return docId;
}

// List documents in a collection
export async function listDocuments(collection) {
  const url = `${FIRESTORE_BASE_URL}/${collection}?key=${FIREBASE_API_KEY}`;
  
  console.log(`📥 [Firestore REST] LIST ${collection}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ [Firestore REST] LIST failed:`, error);
    throw new Error(`Failed to list documents: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  console.log(`✅ [Firestore REST] LIST successful`);
  
  if (!data.documents) {
    return [];
  }
  
  // Convert each document
  return data.documents.map(doc => {
    const id = doc.name.split('/').pop();
    const fields = {};
    
    if (doc.fields) {
      for (const [key, value] of Object.entries(doc.fields)) {
        fields[key] = fromFirestoreValue(value);
      }
    }
    
    return { id, ...fields };
  });
}
