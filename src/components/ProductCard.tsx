import { useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ArrowUpRight, Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addToCart, setQuickViewProduct, toggleWishlist } from '../features/cart/cartSlice';
import type { Product } from '../features/products/productsTypes';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const wishlist = useAppSelector((state) => state.cart.wishlistIds);
  const isSaved = wishlist.includes(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    toast({
      title: isSaved ? 'Removed from saved' : 'Saved to wishlist',
      description: isSaved ? 'Item removed from your favourites' : 'Item saved to your favourites',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  return (
    <Box
      ref={cardRef}
      className="product-card"
      bg="#fffefa"
      border="1px solid"
      borderColor={isHovered ? '#d9cbba' : '#e9e2d7'}
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      display="flex"
      flexDirection="column"
      style={{
        animationDelay: `${Math.min(index, 8) * 45}ms`,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.08s ease-out, box-shadow 0.2s ease' : 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.25s ease',
      }}
      boxShadow={isHovered ? '0 20px 40px rgba(32, 54, 45, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.03)'}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Specular Glare */}
      {isHovered && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          pointerEvents="none"
          zIndex={5}
          borderRadius="2xl"
          bg={`radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.35), transparent 60%)`}
        />
      )}

      {/* Product Image Stage */}
      <Box
        bg="#f3eee7"
        h={{ base: '220px', md: '260px' }}
        p={6}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Badge
          position="absolute"
          top={3.5}
          left={3.5}
          colorScheme="gray"
          bg="#fffefa"
          color="graphite.800"
          textTransform="capitalize"
          borderRadius="md"
          px={2.5}
          py={1}
          fontSize="10px"
          letterSpacing="0.04em"
          fontWeight="700"
          boxShadow="0 2px 6px rgba(0,0,0,0.06)"
          zIndex={2}
        >
          {product.category}
        </Badge>

        <Tooltip label={isSaved ? 'Remove from saved' : 'Save item'}>
          <IconButton
            className="wishlist-button"
            aria-label={isSaved ? 'Remove from saved items' : 'Save item'}
            icon={<Heart size={16} fill={isSaved ? '#d47757' : 'none'} color={isSaved ? '#d47757' : '#20362d'} />}
            onClick={handleToggleWishlist}
            position="absolute"
            top={3}
            right={3}
            size="sm"
            variant="solid"
            bg={isSaved ? '#faeae3' : '#fffefa'}
            borderRadius="full"
            zIndex={2}
            boxShadow="0 2px 6px rgba(0,0,0,0.06)"
            _hover={{ bg: '#faeae3', transform: 'scale(1.1)' }}
          />
        </Tooltip>

        <Image
          src={product.image || undefined}
          alt={product.title}
          maxH="100%"
          maxW="100%"
          objectFit="contain"
          mixBlendMode="multiply"
          fallbackSrc="https://placehold.co/260x260/f3eee7/777?text=No+image"
          transition="transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)"
          transform={isHovered ? 'scale(1.08) translateZ(20px)' : 'scale(1)'}
          className="product-image"
        />

        {/* Floating Quick Action Overlay on Hover */}
        <HStack
          position="absolute"
          bottom={3}
          spacing={2}
          opacity={isHovered ? 1 : 0}
          transform={isHovered ? 'translateY(0)' : 'translateY(10px)'}
          transition="all 0.22s ease"
          zIndex={3}
        >
          <Button
            size="xs"
            bg="whiteAlpha.900"
            color="graphite.900"
            backdropFilter="blur(8px)"
            borderRadius="full"
            leftIcon={<Eye size={12} />}
            boxShadow="0 4px 12px rgba(0,0,0,0.12)"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setQuickViewProduct(product));
            }}
            _hover={{ bg: 'white', color: 'accent.500' }}
          >
            3D Quick View
          </Button>

          <Button
            size="xs"
            bg="graphite.900"
            color="white"
            borderRadius="full"
            leftIcon={<ShoppingBag size={12} />}
            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
            onClick={handleQuickAdd}
            _hover={{ bg: 'accent.500' }}
          >
            Add to Bag
          </Button>
        </HStack>
      </Box>

      {/* Product Card Details */}
      <VStack align="stretch" p={5} spacing={3} flex="1">
        <HStack justify="space-between" align="center" minH="18px" gap={2}>
          <Text fontSize="xs" color="graphite.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1} fontWeight="600">
            {product.category}
          </Text>
          {product.rating && (
            <HStack spacing={1} color="graphite.800" flexShrink={0}>
              <Star size={13} fill="#d9a46a" strokeWidth={1.8} />
              <Text fontSize="xs" fontWeight="750">
                {product.rating.rate.toFixed(1)}
              </Text>
              <Text fontSize="xs" color="gray.400">
                ({product.rating.count})
              </Text>
            </HStack>
          )}
        </HStack>

        <Text
          as={Link}
          to={`/products/${product.id}`}
          fontSize="md"
          fontWeight="700"
          lineHeight="1.45"
          noOfLines={2}
          minH="46px"
          color="graphite.900"
          _hover={{ color: 'accent.500', textDecoration: 'none' }}
        >
          {product.title}
        </Text>

        <Flex justify="space-between" align="center" mt="auto" pt={2} gap={2}>
          <Text fontSize="xl" fontWeight="800" letterSpacing="-0.04em" color="graphite.900">
            ${product.price.toFixed(2)}
          </Text>
          <Button
            as={Link}
            to={`/products/${product.id}`}
            size="sm"
            bg="graphite.900"
            color="white"
            borderRadius="xl"
            rightIcon={<ArrowUpRight size={14} />}
            _hover={{ bg: 'accent.500', color: 'white', transform: 'translateY(-1px)' }}
          >
            Details
          </Button>
        </Flex>

        {isSaved && (
          <Text fontSize="xs" color="accent.600" fontWeight="700" pt={0.5}>
            ★ Saved to your favourites
          </Text>
        )}
      </VStack>
    </Box>
  );
}
