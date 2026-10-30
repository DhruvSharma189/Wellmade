import { Box, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';

export function ProductSkeleton() {
  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="1px solid"
      borderColor="blackAlpha.100"
      overflow="hidden"
    >
      <Skeleton h="245px" startColor="gray.100" endColor="gray.200" />
      <VStack align="stretch" p={5} spacing={4}>
        <Skeleton h="12px" w="35%" />
        <SkeletonText noOfLines={2} spacing={2} />
        <Skeleton h="36px" w="100%" borderRadius="full" />
      </VStack>
    </Box>
  );
}
