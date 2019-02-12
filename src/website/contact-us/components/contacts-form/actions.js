import { send } from 'emailjs-com';
import EMAIL_JS from '/emailJS.config';

export const createContact = (name, email, message, options) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const contacts = firestore.collection('contacts');

    /* Store Contact */
    contacts.where('email', '==', email).get().then(snapshot => {
      const id = snapshot.docs[0] ? snapshot.docs[0].id : null;
      if (id) {
        return contacts.doc(id).update({
          title: name,
          options,
        });
      }
      return contacts.add({
        title: name,
        email,
        options,
        dateTime: new Date(),
      });
    });

    /* Send email to desk */
    const deskParams = {
      'reply_to': email,
      'from_name': name,
      'message_html': message,
    };
    return send(EMAIL_JS.SERVICE_ID, EMAIL_JS.TEMPLATES.CONTACT, deskParams, EMAIL_JS.USER_ID);
  };
};
