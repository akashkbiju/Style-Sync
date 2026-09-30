import { collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Generic fetch function for any collection
export const fetchCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    return list;
  } catch (error) {
    console.warn(`Firestore not configured or network error fetching ${collectionName}:`, error.message);
    return null;
  }
};

// Generic add/set function
export const addDocument = async (collectionName, data) => {
  try {
    if (data.id) {
      // If it already has an ID, use setDoc to maintain it
      await setDoc(doc(db, collectionName, data.id), data);
      return data.id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  } catch (error) {
    console.error(`Error adding to ${collectionName}:`, error);
    throw error;
  }
};

// Generic update function
export const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, String(docId));
    await setDoc(docRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
    return false;
  }
};

// Generic delete function
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error(`Error deleting from ${collectionName}:`, error);
    throw error;
  }
};
