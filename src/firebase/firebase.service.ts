import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';


var serviceAccount = require("../../serviceAccountKey.json");
// import serviceAccount from '../../serviceAccountKey.json';
// const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

@Injectable()
export class FirebaseService {
  public db = db;
  public auth = admin.auth();
}
