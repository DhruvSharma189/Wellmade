import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ArrowUpRight, Heart, MessageSquare, ShoppingBag } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setCartOpen } from '../features/cart/cartSlice';
import { Brand3DEmblem } from './3d/Brand3DEmblem';
import { CartDrawer } from './CartDrawer';
import { QuickViewModal } from './QuickViewModal';

export function AppLayout() {
  const dispatch = useAppDispatch();
  const feedbackCount = useAppSelector((state) => state.feedback.entries.length);
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlist = useAppSelector((state) => state.cart.wishlistIds);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#f8f6f1">
      {/* Top Announcement Bar */}
      <Box bg="#192822" color="white" py={1.5} px={4} textAlign="center" fontSize="11px" fontWeight="600" letterSpacing="0.08em">
        <Text>
          COMPLIMENTARY SHIPPING ON ORDERS OVER $75 · <Text as="span" color="accent.500">NEW 3D INTERACTIVE STUDIO LIVE</Text>
        </Text>
      </Box>

      {/* Main Header */}
      <Box
        as="header"
        bg="graphite.900"
        color="white"
        position="sticky"
        top="0"
        zIndex="30"
        borderBottom="1px solid"
        borderColor="whiteAlpha.150"
        boxShadow="0 4px 20px rgba(0,0,0,0.15)"
        backdropFilter="blur(16px)"
      >
        <Container maxW="1440px" px={{ base: 4, md: 8 }}>
          <Flex minH={{ base: '66px', md: '74px' }} align="center" justify="space-between" gap={4}>
            {/* Logo with 3D Interactive Emblem */}
            <ChakraLink as={Link} to="/" _hover={{ textDecoration: 'none' }} aria-label="WELLMADE home">
              <HStack spacing={3}>
                <Brand3DEmblem />
                <Box>
                  <Text fontSize="xl" fontWeight="800" letterSpacing="-0.055em" lineHeight="1">
                    WELLMADE<span style={{ color: '#e26a45' }}>.</span>
                  </Text>
                  <Text fontSize="9px" color="whiteAlpha.600" letterSpacing="0.22em" mt={1}>
                    EVERYDAY GOODS, CHOSEN WELL
                  </Text>
                </Box>
              </HStack>
            </ChakraLink>

            {/* Navigation & Action Icons */}
            <HStack spacing={{ base: 3, md: 6 }} fontSize="sm" fontWeight="600">
              <ChakraLink
                as={NavLink}
                to="/"
                end
                _activeLink={{ color: 'accent.500', fontWeight: '750' }}
                _hover={{ color: 'accent.500' }}
                display={{ base: 'none', sm: 'inline-flex' }}
              >
                Collection
              </ChakraLink>

              <ChakraLink
                as={NavLink}
                to="/feedback"
                _activeLink={{ color: 'accent.500', fontWeight: '750' }}
                _hover={{ color: 'accent.500' }}
                display="inline-flex"
                alignItems="center"
                gap={1.5}
              >
                <MessageSquare size={16} />
                <Text display={{ base: 'none', md: 'inline' }}>Community</Text>
                <Badge bg="whiteAlpha.200" color="white" borderRadius="full" px={1.5} fontSize="10px">
                  {feedbackCount}
                </Badge>
              </ChakraLink>

              {/* Wishlist Indicator */}
              <Tooltip label={`${wishlist.length} saved items`}>
                <ChakraLink
                  as={Link}
                  to="/#collection"
                  display="inline-flex"
                  alignItems="center"
                  position="relative"
                  color="whiteAlpha.800"
                  _hover={{ color: 'accent.500' }}
                  aria-label="Wishlist"
                >
                  <Heart size={19} />
                  {wishlist.length > 0 && (
                    <Badge
                      position="absolute"
                      top="-7px"
                      right="-8px"
                      bg="accent.500"
                      color="white"
                      fontSize="9px"
                      borderRadius="full"
                      px={1.5}
                    >
                      {wishlist.length}
                    </Badge>
                  )}
                </ChakraLink>
              </Tooltip>

              {/* Shopping Bag / Cart Button */}
              <Button
                variant="solid"
                size="sm"
                bg="whiteAlpha.150"
                color="white"
                borderRadius="xl"
                leftIcon={<ShoppingBag size={17} color="#e26a45" />}
                onClick={() => dispatch(setCartOpen(true))}
                _hover={{ bg: 'whiteAlpha.250' }}
                position="relative"
              >
                <Text display={{ base: 'none', sm: 'inline' }} mr={1}>
                  Bag
                </Text>
                <Badge bg="accent.500" color="white" borderRadius="full" px={2} fontSize="11px">
                  {totalCartCount}
                </Badge>
              </Button>

              <ChakraLink
                as={Link}
                to="/feedback#share-feedback"
                display={{ base: 'none', lg: 'inline-flex' }}
                alignItems="center"
                gap={1}
                bg="#f2e9dc"
                color="graphite.900"
                px={4}
                py={2}
                fontSize="xs"
                fontWeight="700"
                borderRadius="xl"
                _hover={{ bg: 'accent.500', color: 'white' }}
                transition="all 0.2s ease"
              >
                Share Feedback <ArrowUpRight size={14} />
              </ChakraLink>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Page Content */}
      <Box as="main" flex="1">
        <Outlet />
      </Box>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />

      {/* Modern Footer */}
      <Box as="footer" bg="graphite.900" color="white" py={{ base: 12, md: 16 }} mt={20} borderTop="1px solid" borderColor="whiteAlpha.100">
        <Container maxW="1440px" px={{ base: 4, md: 8 }}>
          <Flex
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
            direction={{ base: 'column', md: 'row' }}
            gap={6}
            pb={8}
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
          >
            <HStack spacing={3}>
              <Brand3DEmblem />
              <Box>
                <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.04em">
                  WELLMADE<span style={{ color: '#e26a45' }}>.</span>
                </Text>
                <Text fontSize="xs" color="whiteAlpha.600" letterSpacing="0.15em">
                  EVERYDAY GOODS, CHOSEN WELL
                </Text>
              </Box>
            </HStack>

            <HStack spacing={{ base: 4, md: 8 }} fontSize="sm" color="whiteAlpha.800" wrap="wrap">
              <ChakraLink as={Link} to="/" _hover={{ color: 'accent.500' }}>
                Collection
              </ChakraLink>
              <ChakraLink as={Link} to="/feedback" _hover={{ color: 'accent.500' }}>
                Community Board
              </ChakraLink>
              <ChakraLink as={Link} to="/feedback#share-feedback" _hover={{ color: 'accent.500' }}>
                Leave Feedback
              </ChakraLink>
            </HStack>
          </Flex>

          <Flex
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
            gap={4}
            pt={6}
            fontSize="xs"
            color="whiteAlpha.500"
          >
            <Text>© {new Date().getFullYear()} WELLMADE. All rights reserved.</Text>
            <Text>Crafted with React, TypeScript, Chakra UI & Three.js 3D Engine.</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
