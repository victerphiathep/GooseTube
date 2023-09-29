"use client";

import SignIn from "./sign-in";
import Link from "next/link";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import React from "react";
import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper, getUserPhoto } from "../firebase/firebase";
import { User } from "firebase/auth";
import { BsYoutube } from "react-icons/bs";
import Upload from "./upload";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Heading,
} from "@chakra-ui/react";
import UserProfile from "./user-profile";

interface Props {
  children: React.ReactNode;
}

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () => {
      const unsubscribe = onAuthStateChangedHelper((user) => {
        setUser(user);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    },
    [] /* No dependencies, never rerun */
  );
  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Link href="/">
              {" "}
              <span className={styles.logoContainer}>
                {" "}
                <div>
                  <Heading size="sm" display="flex" alignItems="center">
                  <Text pr={2}>GooseTube</Text>
                    <BsYoutube size={30} style={{ marginRight: "10px" }} />{" "}
                    
                  </Heading>
                  
                </div>{" "}
              </span>{" "}
            </Link>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>

              {user && <Upload />}

              {user ? (
                <>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar size={"sm"} src={getUserPhoto() || undefined} />
                    </MenuButton>
                    <MenuList alignItems={"center"}>
                      <UserProfile />
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <SignIn user={user} />
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}