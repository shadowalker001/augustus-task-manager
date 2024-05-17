import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

// Load Firebase service account credentials
var serviceAccount = require("../../serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

@Injectable()
export class FirebaseService {
  // Firestore database instance
  public db = admin.firestore();
  
  // Firebase Authentication instance
  public auth = admin.auth();
}
