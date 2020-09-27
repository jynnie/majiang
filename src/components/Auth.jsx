import React, { useContext, useEffect } from "react";
import { FirebaseContext, EngineContext } from "../App";

export const Auth = (props) => {
  const { user, db } = useContext(FirebaseContext);
  const { GE } = useContext(EngineContext);
  const { signOut, signInWithGoogle } = props;

  const handleSignIn = (res) => {
    const id = res.user.uid; // Returned from signIn() promise
    const usersRef = db.ref("users/" + id);
    usersRef.once("value").then((doc) => {
      if (!doc.val()) {
        // If we have no user of this uid saved
        usersRef.set({
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

  const uuid = user?.uid;
  useEffect(() => {
    if (user && user.uid) {
      console.debug(
        `🥳 ${user.displayName} has signed in from ${user.providerData[0].providerId} 🥳`,
      );
      GE.user = user;
    }
  }, [user, uuid]);

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
