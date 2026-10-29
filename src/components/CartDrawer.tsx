import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Progress,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCart, removeFromCart, setCartOpen, updateQuantity } from '../features/cart/cartSlice';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { items, isCartOpen } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    toast({
      title: 'Order Placed (Demo)',
      description: `Thank you for shopping at WELLMADE! Order of ${totalCount} items ($${subtotal.toFixed(2)}) received.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
    dispatch(clearCart());
    dispatch(setCartOpen(false));
  };

  return (
    <Drawer isOpen={isCartOpen} placement="right" size="md" onClose={() => dispatch(setCartOpen(false))}>
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent bg="#fdfbf7" color="graphite.900" borderLeft="1px solid" borderColor="#e8e0d5">
        <DrawerCloseButton top={4} right={4} />
        <DrawerHeader borderBottom="1px solid" borderColor="#eee7dc" py={5}>
          <HStack spacing={2}>
            <ShoppingBag size={20} color="#d47757" />
            <Text fontSize="lg" fontWeight="800" letterSpacing="-0.03em">
              Your Bag ({totalCount})
            </Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody px={{ base: 4, md: 6 }} py={4}>
          {/* Free Shipping Tracker */}
          <Box bg="#f5efe6" p={3.5} borderRadius="xl" mb={5} border="1px solid" borderColor="#e8ded0">
            <Flex justify="space-between" fontSize="xs" fontWeight="700" mb={2}>
              <Text color="graphite.700">
                {subtotal >= freeShippingThreshold ? (
                  <Text as="span" color="green.600">
                    🎉 Free express shipping unlocked!
                  </Text>
                ) : (
                  `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`
                )}
              </Text>
              <Text color="graphite.500">{progressToFreeShipping.toFixed(0)}%</Text>
            </Flex>
            <Progress value={progressToFreeShipping} size="xs" colorScheme="orange" borderRadius="full" />
          </Box>

          {items.length === 0 ? (
            <VStack spacing={4} py={16} textAlign="center">
              <Box p={5} bg="#f2ece1" borderRadius="full" color="graphite.500">
                <ShoppingBag size={32} />
              </Box>
              <Text fontSize="xl" fontWeight="750" letterSpacing="-0.03em">
                Your bag is empty
              </Text>
              <Text fontSize="sm" color="gray.500" maxW="260px">
                Discover everyday favourites in our curated collection.
              </Text>
              <Button
                bg="graphite.900"
                color="white"
                size="sm"
                mt={2}
                onClick={() => dispatch(setCartOpen(false))}
                _hover={{ bg: 'accent.500' }}
              >
                Start shopping
              </Button>
            </VStack>
          ) : (
            <VStack align="stretch" spacing={4}>
              {items.map(({ product, quantity }) => (
                <Flex
                  key={product.id}
                  p={3.5}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="#ece4d8"
                  gap={3.5}
                  align="center"
                  boxShadow="0 2px 8px rgba(0,0,0,0.02)"
                >
                  <Box
                    w="72px"
                    h="72px"
                    bg="#f5f2eb"
                    borderRadius="lg"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Image
                      src={product.image || undefined}
                      alt={product.title}
                      maxH="100%"
                      maxW="100%"
                      objectFit="contain"
                      mixBlendMode="multiply"
                      fallbackSrc="https://placehold.co/100x100/f5f2eb/777?text=No+img"
                    />
                  </Box>

                  <Box flex="1" minW="0">
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.06em" noOfLines={1}>
                      {product.category}
                    </Text>
                    <Text fontSize="sm" fontWeight="700" color="graphite.900" noOfLines={1} title={product.title}>
                      {product.title}
                    </Text>
                    <Text fontSize="sm" fontWeight="800" color="graphite.900" mt={1}>
                      ${(product.price * quantity).toFixed(2)}
                    </Text>
                  </Box>

                  {/* Quantity Stepper */}
                  <HStack spacing={1} bg="#f4efe6" borderRadius="lg" p={1} flexShrink={0}>
                    <IconButton
                      aria-label="Decrease quantity"
                      size="xs"
                      variant="ghost"
                      icon={<Minus size={12} />}
                      onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity - 1 }))}
                    />
                    <Text fontSize="xs" fontWeight="700" minW="18px" textAlign="center">
                      {quantity}
                    </Text>
                    <IconButton
                      aria-label="Increase quantity"
                      size="xs"
                      variant="ghost"
                      icon={<Plus size={12} />}
                      onClick={() => dispatch(updateQuantity({ id: product.id, quantity: quantity + 1 }))}
                    />
                  </HStack>

                  <IconButton
                    aria-label="Remove item"
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    icon={<Trash2 size={14} />}
                    onClick={() => dispatch(removeFromCart(product.id))}
                    _hover={{ color: 'red.500', bg: 'red.50' }}
                  />
                </Flex>
              ))}
            </VStack>
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter borderTop="1px solid" borderColor="#eee7dc" display="flex" flexDirection="column" gap={3}>
            <Flex justify="space-between" w="100%" fontSize="md" fontWeight="800">
              <Text color="graphite.700">Subtotal</Text>
              <Text color="graphite.900">${subtotal.toFixed(2)}</Text>
            </Flex>
            <Text fontSize="xs" color="gray.500" alignSelf="start">
              Shipping & taxes calculated at checkout.
            </Text>
            <Button
              w="100%"
              h="50px"
              bg="graphite.900"
              color="white"
              fontWeight="700"
              fontSize="sm"
              borderRadius="xl"
              rightIcon={<ArrowRight size={16} />}
              onClick={handleCheckout}
              _hover={{ bg: 'accent.500', transform: 'translateY(-1px)' }}
              transition="all 0.2s ease"
            >
              Checkout · ${subtotal.toFixed(2)}
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
