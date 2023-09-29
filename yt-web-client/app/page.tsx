import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import { MantineProvider } from "@mantine/core";
import { ChakraProvider, Box, useColorModeValue, extendTheme } from "@chakra-ui/react"; // Import ChakraProvider
import { ColorModeScript } from '@chakra-ui/react'
import styles from "./page.module.css";
import React from 'react';
import Hero from "./hero";

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}  


export const theme = extendTheme({ colors })


export default function Home() {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {" "}
      {/* Wrap your component with ChakraProvider */}
      <Hero/>  
    </ChakraProvider>
  );
}
