import { collection, doc, getDocs, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const STAFF_COLLECTION = 'staff';

// Fetch all staff members
export const fetchStaffFromDB = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, STAFF_COLLECTION));
    const staffList = [];
    querySnapshot.forEach((doc) => {
      staffList.push({ id: doc.id, ...doc.data() });
    });
    return staffList;
  } catch (error) {
    console.error("Error fetching staff from Firestore:", error);
    return [];
  }
};

// Add a new staff member
export const addStaffToDB = async (staffData) => {
  try {
    // If the data already has an ID, we use setDoc to preserve it, otherwise let Firestore generate an ID
    if (staffData.id) {
      await setDoc(doc(db, STAFF_COLLECTION, staffData.id), staffData);
      return staffData.id;
    } else {
      const docRef = await addDoc(collection(db, STAFF_COLLECTION), staffData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error adding staff to Firestore:", error);
    throw error;
  }
};

// Update an existing staff member
export const updateStaffInDB = async (staffId, updatedData) => {
  try {
    const staffRef = doc(db, STAFF_COLLECTION, String(staffId));
    await setDoc(staffRef, updatedData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating staff in Firestore:", error);
    return false;
  }
};

// Delete a staff member
export const deleteStaffFromDB = async (staffId) => {
  try {
    await deleteDoc(doc(db, STAFF_COLLECTION, staffId));
    return true;
  } catch (error) {
    console.error("Error deleting staff from Firestore:", error);
    throw error;
  }
};
