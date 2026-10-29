import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  ArrowLeft,
  Check,
  Eye,
  Heart,
  Minus,
  Plus,
  Rotate3d,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart, toggleWishlist } from '../features/cart/cartSlice';
import type { Product } from '../features/products/productsTypes';
import { fetchProductById } from '../services/productsApi';
import { Product3DViewer } from '../components/3d/Product3DViewer';

export function ProductDetailsPage() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mediaTab, setMediaTab] = useState(0);

  const wishlist = useAppSelector((state) => state.cart.wishlistIds);
  const isSaved = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    const controller = new AbortController();
    const id = Number(productId);
    if (!Number.isInteger(id) || id < 1) {
      setError('PRODUCT_NOT_FOUND');
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    setError(null);
    void fetchProductById(id, controller.signal)
      .then(setProduct)
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : 'Unable to load this product.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    toast({
      title: 'Added to your bag',
      description: `${quantity} × ${product.title} has been added.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product.id));
    toast({
      title: isSaved ? 'Removed from saved items' : 'Saved to favourites',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  return (
    <Container maxW="1320px" px={{ base: 4, md: 8 }} py={{ base: 8, md: 14 }}>
      {/* Back Button */}
      <Button as={Link} to="/" variant="ghost" leftIcon={<ArrowLeft size={16} />} mb={8} borderRadius="xl">
        Back to collection
      </Button>

      {/* Loading Skeleton */}
      {loading && (
        <Flex gap={10} direction={{ base: 'column', md: 'row' }}>
          <Skeleton h={{ base: '340px', md: '540px' }} flex="1" borderRadius="2xl" />
          <VStack align="stretch" flex="1" spacing={5}>
            <Skeleton h="24px" w="25%" borderRadius="md" />
            <Skeleton h="56px" borderRadius="md" />
            <Skeleton h="36px" w="30%" borderRadius="md" />
            <Skeleton h="120px" borderRadius="md" />
            <Skeleton h="54px" borderRadius="xl" />
          </VStack>
        </Flex>
      )}

      {/* Error State */}
      {!loading && error && (
        <Alert
          status={error === 'PRODUCT_NOT_FOUND' ? 'warning' : 'error'}
          borderRadius="2xl"
          p={6}
          alignItems="start"
        >
          <AlertIcon mt={1} />
          <Box flex="1">
            <Text fontWeight="800" fontSize="lg">
              {error === 'PRODUCT_NOT_FOUND' ? 'Product not found' : 'We couldn’t load this product'}
            </Text>
            <Text fontSize="sm" mt={1} color="gray.600">
              {error === 'PRODUCT_NOT_FOUND'
                ? 'This item may have been removed or the product link is outdated.'
                : error}
            </Text>
            <Button as={Link} to="/" mt={4} size="sm" bg="graphite.900" color="white" _hover={{ bg: 'graphite.700' }}>
              Return to collection
            </Button>
          </Box>
        </Alert>
      )}

      {/* Product Content */}
      {!loading && !error && product && (
        <Flex direction={{ base: 'column', lg: 'row' }} gap={{ base: 10, lg: 16 }} align="start">
          {/* Media Viewport with Photography & 3D Turntable Tabs */}
          <Box flex={{ base: '1', lg: '1.1' }} w="100%">
            <Tabs index={mediaTab} onChange={setMediaTab} variant="soft-rounded" colorScheme="orange">
              <TabList bg="#eee7dc" p={1.5} borderRadius="full" mb={4} maxW="fit-content">
                <Tab fontSize="xs" fontWeight="700" borderRadius="full" _selected={{ bg: 'white', color: 'graphite.900', boxShadow: 'sm' }}>
                  <HStack spacing={1.5}>
                    <Eye size={14} />
                    <Text>Studio Photo</Text>
                  </HStack>
                </Tab>
                <Tab
                  fontSize="xs"
                  fontWeight="700"
                  borderRadius="full"
                  _selected={{ bg: 'graphite.900', color: 'white', boxShadow: 'sm' }}
                >
                  <HStack spacing={1.5}>
                    <Rotate3d size={14} color="#e26a45" />
                    <Text>Interactive 3D Turntable</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Tab 1: 2D Photo */}
                <TabPanel p={0}>
                  <Box
                    bg="#eeefea"
                    borderRadius="2xl"
                    minH={{ base: '320px', md: '520px' }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={{ base: 8, md: 14 }}
                    position="relative"
                    border="1px solid"
                    borderColor="#e2ded4"
                    boxShadow="0 12px 30px rgba(0,0,0,0.03)"
                  >
                    <Image
                      src={product.image || undefined}
                      alt={product.title}
                      maxH="440px"
                      maxW="90%"
                      objectFit="contain"
                      mixBlendMode="multiply"
                      fallbackSrc="https://placehold.co/500x500/eeefea/777?text=No+image"
                      transition="transform 0.3s ease"
                      _hover={{ transform: 'scale(1.04)' }}
                    />

                    {/* Hint overlay to try 3D view */}
                    <Button
                      position="absolute"
                      bottom={4}
                      right={4}
                      size="xs"
                      bg="whiteAlpha.900"
                      color="graphite.900"
                      backdropFilter="blur(8px)"
                      borderRadius="full"
                      leftIcon={<Rotate3d size={13} color="#d47757" />}
                      onClick={() => setMediaTab(1)}
                      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
                    >
                      Switch to 3D Turntable
                    </Button>
                  </Box>
                </TabPanel>

                {/* Tab 2: Interactive 3D Turntable */}
                <TabPanel p={0}>
                  <Product3DViewer product={product} height={{ base: '340px', md: '520px' }} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Product Details & Actions */}
          <VStack flex="1" align="stretch" spacing={6} pt={{ lg: 2 }}>
            <HStack justify="space-between" align="center">
              <Badge colorScheme="gray" bg="#eee7dc" color="graphite.700" textTransform="capitalize" borderRadius="full" px={3.5} py={1.5} fontWeight="700">
                {product.category}
              </Badge>
              <HStack spacing={1.5} color="green.600" fontSize="xs" fontWeight="700">
                <Check size={14} />
                <Text>In stock & ready to ship</Text>
              </HStack>
            </HStack>

            <Text as="h1" fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} lineHeight="1.08" fontWeight="800" letterSpacing="-0.05em">
              {product.title}
            </Text>

            {/* Price & Rating */}
            <HStack align="center" spacing={4} wrap="wrap">
              <Text fontSize="3xl" fontWeight="800" letterSpacing="-0.04em" color="graphite.900">
                ${product.price.toFixed(2)}
              </Text>
              {product.rating && (
                <HStack color="graphite.800" spacing={1.5} bg="#f4ede2" px={3} py={1} borderRadius="full">
                  <Star size={15} fill="#d9a46a" strokeWidth={1.8} />
                  <Text fontSize="sm" fontWeight="750">
                    {product.rating.rate.toFixed(1)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    ({product.rating.count} customer reviews)
                  </Text>
                </HStack>
              )}
            </HStack>

            <Box h="1px" bg="blackAlpha.100" />

            {/* Description */}
            <Box>
              <Text className="eyebrow">THE DETAILS</Text>
              <Text color="gray.700" lineHeight="1.8" mt={2} fontSize="md">
                {product.description}
              </Text>
            </Box>

            {/* Quantity Stepper & Add to Bag CTA */}
            <VStack align="stretch" spacing={3} pt={2}>
              <HStack spacing={3}>
                {/* Quantity */}
                <HStack bg="#eee7dc" borderRadius="xl" p={1} flexShrink={0}>
                  <IconButton
                    aria-label="Decrease quantity"
                    size="md"
                    variant="ghost"
                    icon={<Minus size={15} />}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  />
                  <Text fontWeight="800" minW="28px" textAlign="center">
                    {quantity}
                  </Text>
                  <IconButton
                    aria-label="Increase quantity"
                    size="md"
                    variant="ghost"
                    icon={<Plus size={15} />}
                    onClick={() => setQuantity((q) => q + 1)}
                  />
                </HStack>

                {/* Add to Bag Button */}
                <Button
                  flex="1"
                  h="52px"
                  bg="graphite.900"
                  color="white"
                  fontWeight="750"
                  borderRadius="xl"
                  leftIcon={<ShoppingBag size={18} />}
                  onClick={handleAddToCart}
                  _hover={{ bg: 'accent.500', transform: 'translateY(-1px)' }}
                  boxShadow="0 4px 16px rgba(0,0,0,0.12)"
                >
                  Add to Bag · ${(product.price * quantity).toFixed(2)}
                </Button>

                {/* Wishlist Button */}
                <IconButton
                  aria-label={isSaved ? 'Remove from favourites' : 'Save to favourites'}
                  h="52px"
                  w="52px"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="#d8cfbf"
                  variant="outline"
                  icon={<Heart size={20} fill={isSaved ? '#d47757' : 'none'} color={isSaved ? '#d47757' : '#20362d'} />}
                  onClick={handleToggleWishlist}
                  _hover={{ bg: '#faeae3' }}
                />
              </HStack>
            </VStack>

            {/* Value Guarantees */}
            <HStack spacing={4} pt={2} fontSize="xs" color="gray.600" wrap="wrap">
              <HStack spacing={1.5}>
                <Truck size={15} color="#d47757" />
                <Text>Free carbon-neutral delivery over $75</Text>
              </HStack>
              <HStack spacing={1.5}>
                <ShieldCheck size={15} color="#d47757" />
                <Text>30-day effortless returns</Text>
              </HStack>
            </HStack>

            {/* Accordion for specifications */}
            <Accordion allowMultiple mt={4}>
              <AccordionItem borderTop="1px solid" borderColor="blackAlpha.100" borderBottom="none">
                <h2>
                  <AccordionButton py={3.5} px={0} _hover={{ bg: 'transparent' }}>
                    <Box flex="1" textAlign="left" fontWeight="750" fontSize="sm">
                      Care & Craftsmanship
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} px={0} fontSize="sm" color="gray.600" lineHeight="1.7">
                  Selected with enduring materials built for daily utility. Clean with a soft damp cloth. Store away from
                  excessive heat and moisture.
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem borderTop="1px solid" borderColor="blackAlpha.100" borderBottom="1px solid">
                <h2>
                  <AccordionButton py={3.5} px={0} _hover={{ bg: 'transparent' }}>
                    <Box flex="1" textAlign="left" fontWeight="750" fontSize="sm">
                      Shipping & Delivery
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} px={0} fontSize="sm" color="gray.600" lineHeight="1.7">
                  Orders ship within 1-2 business days in recyclable cardboard packaging. Standard delivery takes 3-5 days.
                  Track your parcel directly through order notifications.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        </Flex>
      )}
    </Container>
  );
}
