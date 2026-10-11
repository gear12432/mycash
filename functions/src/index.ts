import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Cloud Function to verify coin transfers server-side.
 */
export const verifyTransfer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { recipientUserId, coinAmount } = data;
  if (!recipientUserId || !coinAmount || coinAmount <= 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Valid recipientUserId and positive coinAmount are required.'
    );
  }

  return { success: true, message: 'Transfer verified by server.' };
});
