import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from "./sign-in.module.css";
import { User } from "firebase/auth";
import { Fragment } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  return (
    <Fragment>
      {user ? (
        // If user is signed in, show a welcome message (or something else)
        <Button colorScheme="teal" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      ) : (
        // If user is not signed in, show sign-in button
        <Button
          as={"a"}
          fontSize={"sm"}
          fontWeight={400}
          variant={"link"}
          href={"#"}
          onClick={signInWithGoogle}
        >
          Sign In
        </Button>
      )}
    </Fragment>
  );
}
