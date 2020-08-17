import React, { useContext } from "react";
import { FirebaseContext } from "../App";

export const Auth = (props) => {
  const { user, db } = useContext(FirebaseContext);
  const { signOut, signInWithGoogle } = props;

  const handleSignIn = (res) => {
    const usersRef = db.collection("users");
    const id = res.user.uid; // Returned from signIn() promise
    usersRef
      .doc(id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // If we have no user of this uid saved
          usersRef.doc(id).set({
            // Create a new user document
            uid: id,
            displayName: res.user.displayName,
            provider: res.credential.providerId,
          });
        }
      });
  };

  const handleSignInWithGoogle = () => {
    if (signInWithGoogle) signInWithGoogle().then((res) => handleSignIn(res));
  };

  if (user)
    console.debug(
      `🥳 ${user.displayName} has signed in from ${user.providerData[0].providerId} 🥳`,
    );

  return (
    <div>
      {user && <span>Hello, {user.displayName}</span>}
      {user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
