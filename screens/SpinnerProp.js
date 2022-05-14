import React from "react";
import { Spinner, HStack, Heading, Center, NativeBaseProvider } from "native-base";
export default function SpinnerComp() {
  return <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color="primary.500" fontSize="md">
        Loading
      </Heading>
    </HStack>;
};