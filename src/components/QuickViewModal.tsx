import { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ArrowUpRight, Box as BoxIcon, Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart, setQuickViewProduct, toggleWishlist } from '../features/cart/cartSlice';
import { Product3DViewer } from './3d/Product3DViewer';

export function QuickViewModal() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const product = useAppSelector((state) => state.cart.quickViewProduct);
  const wishlistIds = useAppSelector((state) => state.cart.wishlistIds);
  const [tabIndex, setTabIndex] = useState(0);

  if (!product) return null;

  const isSaved = wishlistIds.includes(product.id);

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast({
      title: 'Added to bag',
      description: `${product.title} has been added.`,
      status: 'success',
      duration: 2500,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <Modal isOpen={!!product} onClose={() => dispatch(setQuickViewProduct(null))} size="4xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" bg="blackAlpha.700" />
      <ModalContent bg="#fdfcf9" borderRadius="2xl" overflow="hidden" border="1px solid" borderColor="#e7ded2" m={4}>
        <ModalCloseButton top={4} right={4} zIndex={10} bg="whiteAlpha.800" borderRadius="full" />
        <ModalBody p={0}>
          <Flex direction={{ base: 'column', md: 'row' }}>
            {/* Left media column: Photo vs 3D Turntable */}
            <Box flex={{ base: '1', md: '1.1' }} bg="#f0ece4" p={4} display="flex" flexDirection="column">
              <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" colorScheme="orange" size="sm" mb={3}>
                <TabList bg="blackAlpha.100" p={1} borderRadius="full" alignSelf="center">
                  <Tab fontSize="xs" fontWeight="700" borderRadius="full" _selected={{ bg: 'white', color: 'graphite.900' }}>
                    <HStack spacing={1.5}>
                      <Eye size={13} />
                      <Text>Photo</Text>
                    </HStack>
                  </Tab>
                  <Tab fontSize="xs" fontWeight="700" borderRadius="full" _selected={{ bg: 'graphite.900', color: 'white' }}>
                    <HStack spacing={1.5}>
                      <BoxIcon size={13} />
                      <Text>3D Turntable</Text>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0} pt={2}>
                    <Box
                      h={{ base: '260px', md: '380px' }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      p={6}
                    >
                      <Image
                        src={product.image || undefined}
                        alt={product.title}
                        maxH="100%"
                        maxW="100%"
                        objectFit="contain"
                        mixBlendMode="multiply"
                        fallbackSrc="https://placehold.co/400x400/f0ece4/777?text=No+image"
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel p={0} pt={2}>
                    <Product3DViewer product={product} height={{ base: '260px', md: '380px' }} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {/* Right details column */}
            <VStack flex="1" p={{ base: 6, md: 8 }} align="stretch" spacing={4} justify="space-between">
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between" align="center">
                  <Badge colorScheme="gray" bg="#eee7dc" color="graphite.700" textTransform="capitalize" borderRadius="md" px={2.5} py={1}>
                    {product.category}
                  </Badge>
                  {product.rating && (
                    <HStack spacing={1} color="graphite.800">
                      <Star size={14} fill="#d9a46a" strokeWidth={1.8} />
                      <Text fontSize="xs" fontWeight="700">
                        {product.rating.rate.toFixed(1)}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        ({product.rating.count} reviews)
                      </Text>
                    </HStack>
                  )}
                </HStack>

                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color="graphite.900" letterSpacing="-0.04em" lineHeight="1.2">
                  {product.title}
                </Text>

                <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.04em" color="graphite.900">
                  ${product.price.toFixed(2)}
                </Text>

                <Text fontSize="sm" color="gray.600" lineHeight="1.7" noOfLines={4}>
                  {product.description}
                </Text>
              </VStack>

              <VStack align="stretch" spacing={2.5} pt={4}>
                <HStack spacing={2}>
                  <Button
                    flex="1"
                    h="48px"
                    bg="graphite.900"
                    color="white"
                    fontWeight="700"
                    leftIcon={<ShoppingBag size={17} />}
                    onClick={handleAdd}
                    _hover={{ bg: 'accent.500' }}
                  >
                    Add to bag
                  </Button>
                  <Button
                    h="48px"
                    w="48px"
                    variant="outline"
                    borderColor="#dcd4c6"
                    onClick={() => dispatch(toggleWishlist(product.id))}
                    _hover={{ bg: '#faeae3', borderColor: 'accent.500' }}
                    aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isSaved ? '#d47757' : 'none'} color={isSaved ? '#d47757' : '#20362d'} />
                  </Button>
                </HStack>

                <Button
                  as={Link}
                  to={`/products/${product.id}`}
                  variant="ghost"
                  size="sm"
                  color="graphite.700"
                  rightIcon={<ArrowUpRight size={14} />}
                  onClick={() => dispatch(setQuickViewProduct(null))}
                  _hover={{ color: 'accent.500' }}
                >
                  View full product specifications
                </Button>
              </VStack>
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
