import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as React from "react";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Appearance } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarHidden } from "expo-status-bar";
import { useFonts } from "expo-font";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

Appearance.setColorScheme("light");
NavigationBar.setPositionAsync("relative");
NavigationBar.setVisibilityAsync("hidden");
NavigationBar.setBehaviorAsync("inset-swipe");
setStatusBarHidden(true, "none");
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  const [loaded, error] = useFonts({
    GothamBook: require("~/assets/fonts/gotham-book.otf"),
    GothamBold: require("~/assets/fonts/gotham-bold.ttf"),
    GothamMedium: require("~/assets/fonts/gotham-medium.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded && !loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      />
      <PortalHost />
    </ThemeProvider>
  );
}
