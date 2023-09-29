import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import { MantineProvider } from "@mantine/core";
import {
  ChakraProvider,
  Box,
  useColorModeValue,
  extendTheme,
  Container,
  Heading,
  Text,
  Card,
  CardHeader,
  Center,
  Stack,
} from "@chakra-ui/react"; // Import ChakraProvider
import { ColorModeScript } from "@chakra-ui/react";
import styles from "./page.module.css";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({ colors });

export default async function Hero() {
  const videos = await getVideos();

  return (
    <div>
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 4, md: 5 }}
          py={{ base: 25, md: 20 }}
        >
          <Center>
            <Heading
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Welcome to GooseTube!
            </Heading>
          </Center>
          <Center>
            <Text color={"gray.500"} maxW={"3xl"}>
              This is a video sharing platform for all friends of Goose.
            </Text>
          </Center>
        </Stack>
      </Container>
      <div>
      {videos.map((video) => (
            <Link key={video.filename} href={`/watch?v=${video.filename}`}>
              <Image
                src="/thumbnail.png"
                alt="video"
                width={120}
                height={80}
                className={styles.thumbnail}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}
