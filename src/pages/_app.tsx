import NavBar from "@/components/Nav";
import "@/styles/globals.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import "@mantine/core/styles.css";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <ClerkProvider
      {...pageProps}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <NavBar />
        <MantineProvider defaultColorScheme="dark">
          <Component {...pageProps} />
        </MantineProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default MyApp;
