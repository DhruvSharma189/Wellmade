import { useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  ArrowDown,
  ArrowUpRight,
  Rotate3d,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  clearFilters,
  loadProducts,
  setCategory,
  setMinRating,
  setPriceRange,
  setQuery,
  setSort,
} from '../features/products/productsSlice';
import { selectCategories, selectFilteredProducts } from '../features/products/productsSelectors';
import type { PriceRange, SortOption } from '../features/products/productsTypes';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { FeedbackForm } from '../components/FeedbackForm';
import { Hero3DCanvas } from '../components/3d/Hero3DCanvas';

const moneyRanges: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'Any price' },
  { value: 'under-25', label: 'Under $25' },
  { value: '25-75', label: '$25 – $75' },
  { value: 'over-75', label: 'Over $75' },
];

export function HomePage() {
  const dispatch = useAppDispatch();
  const { status, error, query, category, priceRange, minRating, sort, items } = useAppSelector(
    (state) => state.products
  );
  const products = useAppSelector(selectFilteredProducts);
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadProducts());
    }
  }, [dispatch, status]);

  const hasFilters =
    query !== '' || category !== 'all' || priceRange !== 'all' || minRating > 0 || sort !== 'featured';

  return (
    <>
      {/* Hero Section with Interactive 3D Canvas */}
      <Box bg="graphite.900" color="white" overflow="hidden" position="relative" pt={{ base: 6, md: 10 }} pb={{ base: 12, md: 20 }}>
        <Box className="hero-glow" />
        <Container maxW="1440px" px={{ base: 4, md: 8 }} position="relative">
          <Grid templateColumns={{ base: '1fr', lg: '1.1fr 1fr' }} gap={{ base: 10, lg: 12 }} alignItems="center">
            {/* Left Hero Typography */}
            <VStack align="start" spacing={6} maxW="720px">
              <HStack
                spacing={2}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="full"
                px={3.5}
                py={2}
              >
                <Box w="7px" h="7px" bg="accent.500" borderRadius="full" />
                <Text fontSize="xs" color="whiteAlpha.900" letterSpacing="0.14em" textTransform="uppercase" fontWeight="700">
                  A little less, a little better · Vol. 01
                </Text>
              </HStack>

              <Text
                as="h1"
                fontSize={{ base: '4xl', sm: '5xl', md: '7xl' }}
                lineHeight="0.96"
                letterSpacing="-0.075em"
                fontWeight="800"
              >
                Good things.
                <br />
                <Text as="span" color="accent.500">
                  Wellmade.
                </Text>
              </Text>

              <Text fontSize={{ base: 'md', md: 'xl' }} color="whiteAlpha.750" maxW="520px" lineHeight="1.8">
                Everyday favourites, useful finds and little things worth keeping. Interactive 3D inspection meets
                thoughtfully curated goods.
              </Text>

              {/* Action Buttons & Statistics */}
              <VStack align="start" spacing={3} pt={2} w="100%">
                <HStack spacing={3} wrap="wrap">
                  <Button
                    as="a"
                    href="#collection"
                    size="lg"
                    bg="accent.500"
                    color="graphite.900"
                    fontWeight="750"
                    borderRadius="xl"
                    rightIcon={<ArrowDown size={17} />}
                    _hover={{ bg: 'accent.600', transform: 'translateY(-2px)' }}
                    boxShadow="0 8px 24px rgba(212, 119, 87, 0.3)"
                  >
                    Explore Collection
                  </Button>

                  <Button
                    as="a"
                    href="#3d-studio"
                    size="lg"
                    variant="outline"
                    borderColor="whiteAlpha.300"
                    color="white"
                    borderRadius="xl"
                    leftIcon={<Rotate3d size={17} color="#d47757" />}
                    _hover={{ bg: 'whiteAlpha.150', borderColor: 'accent.500' }}
                  >
                    3D Interactive Studio
                  </Button>
                </HStack>

                <HStack spacing={4} pt={2} fontSize="xs" color="whiteAlpha.600" wrap="wrap">
                  <Text>✓ {items.length > 0 ? `${items.length} Curated pieces` : 'Curated collection'}</Text>
                  <Text>✓ Interactive 3D inspection</Text>
                  <Text>✓ Direct API synchronization</Text>
                </HStack>
              </VStack>
            </VStack>

            {/* Right Hero: Real Interactive Three.js 3D Canvas */}
            <Box id="3d-studio" position="relative" w="100%">
              <Hero3DCanvas />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Main Collection Section */}
      <Container id="collection" maxW="1440px" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        {/* Section Header */}
        <Flex
          align={{ base: 'start', md: 'end' }}
          justify="space-between"
          gap={4}
          mb={8}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box>
            <HStack spacing={2} mb={1}>
              <Sparkles size={14} color="#d47757" />
              <Text className="eyebrow">THE COLLECTION</Text>
            </HStack>
            <Text as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="800" letterSpacing="-0.06em">
              Everyday Goods, Chosen Well.
            </Text>
            <Text color="gray.600" mt={1}>
              Filter by category, search by name, or spin items in 3D to inspect details.
            </Text>

            {/* Category Navigation Pills */}
            <HStack spacing={2} mt={4} wrap="wrap">
              <Button
                size="sm"
                borderRadius="full"
                variant="solid"
                bg={category === 'all' ? 'graphite.900' : '#fffefa'}
                color={category === 'all' ? 'white' : 'graphite.700'}
                border="1px solid"
                borderColor={category === 'all' ? 'graphite.900' : '#ded7ca'}
                onClick={() => dispatch(setCategory('all'))}
                _hover={{ bg: category === 'all' ? 'graphite.800' : '#faeae3' }}
              >
                Everything ({items.length})
              </Button>
              {categories.map((item) => {
                const count = items.filter((p) => p.category === item).length;
                const isSelected = category === item;
                return (
                  <Button
                    key={item}
                    size="sm"
                    borderRadius="full"
                    variant="solid"
                    bg={isSelected ? 'graphite.900' : '#fffefa'}
                    color={isSelected ? 'white' : 'graphite.700'}
                    border="1px solid"
                    borderColor={isSelected ? 'graphite.900' : '#ded7ca'}
                    textTransform="capitalize"
                    onClick={() => dispatch(setCategory(item))}
                    _hover={{ bg: isSelected ? 'graphite.800' : '#faeae3' }}
                  >
                    {item} ({count})
                  </Button>
                );
              })}
            </HStack>
          </Box>

          <Text fontSize="sm" color="gray.500" fontWeight="600">
            {status === 'succeeded' ? `Showing ${products.length} of ${items.length} goods` : 'Loading goods...'}
          </Text>
        </Flex>

        {/* Active Filter Tags */}
        {hasFilters && (
          <Flex wrap="wrap" gap={2} mb={6} align="center">
            <Text fontSize="xs" color="gray.500" fontWeight="700">
              Active filters:
            </Text>
            {query && (
              <Tag size="md" borderRadius="full" variant="subtle" colorScheme="orange">
                <TagLabel>Search: "{query}"</TagLabel>
                <TagCloseButton onClick={() => dispatch(setQuery(''))} />
              </Tag>
            )}
            {category !== 'all' && (
              <Tag size="md" borderRadius="full" variant="subtle" colorScheme="green">
                <TagLabel>Category: {category}</TagLabel>
                <TagCloseButton onClick={() => dispatch(setCategory('all'))} />
              </Tag>
            )}
            {priceRange !== 'all' && (
              <Tag size="md" borderRadius="full" variant="subtle" colorScheme="blue">
                <TagLabel>Price: {moneyRanges.find((r) => r.value === priceRange)?.label}</TagLabel>
                <TagCloseButton onClick={() => dispatch(setPriceRange('all'))} />
              </Tag>
            )}
            {minRating > 0 && (
              <Tag size="md" borderRadius="full" variant="subtle" colorScheme="purple">
                <TagLabel>Rating: {minRating}+ Stars</TagLabel>
                <TagCloseButton onClick={() => dispatch(setMinRating(0))} />
              </Tag>
            )}
            <Button size="xs" variant="ghost" colorScheme="red" onClick={() => dispatch(clearFilters())}>
              Clear all
            </Button>
          </Flex>
        )}

        {/* Content Layout: Filter Sidebar + Products Grid */}
        <Grid templateColumns={{ base: '1fr', lg: '260px 1fr' }} gap={{ base: 6, lg: 8 }} alignItems="start">
          {/* Filter Sidebar */}
          <Box
            bg="#fffefa"
            border="1px solid"
            borderColor="#e8dfd2"
            borderRadius="2xl"
            p={5}
            position={{ lg: 'sticky' }}
            top={{ lg: '96px' }}
            boxShadow="0 4px 16px rgba(0,0,0,0.02)"
          >
            <Flex justify="space-between" align="center" mb={5}>
              <HStack spacing={2}>
                <SlidersHorizontal size={17} color="#d47757" />
                <Text fontWeight="800" fontSize="md">
                  Refine Search
                </Text>
              </HStack>
              {hasFilters && (
                <Button size="xs" variant="ghost" onClick={() => dispatch(clearFilters())} rightIcon={<X size={13} />}>
                  Reset
                </Button>
              )}
            </Flex>

            <VStack align="stretch" spacing={5}>
              {/* Keyword Search */}
              <Box>
                <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em" mb={2}>
                  Search
                </Text>
                <Box position="relative">
                  <Box position="absolute" left={3} top="12px" color="gray.400">
                    <Search size={16} />
                  </Box>
                  <Input
                    value={query}
                    onChange={(e) => dispatch(setQuery(e.target.value))}
                    placeholder="Search by title or category..."
                    pl={10}
                    size="md"
                    borderRadius="xl"
                    bg="#faf7f2"
                    borderColor="#e5ddd0"
                    aria-label="Search products"
                  />
                  {query && (
                    <IconButton
                      aria-label="Clear search"
                      size="xs"
                      variant="ghost"
                      icon={<X size={13} />}
                      position="absolute"
                      right={2}
                      top="10px"
                      onClick={() => dispatch(setQuery(''))}
                    />
                  )}
                </Box>
              </Box>

              {/* Categories */}
              <Box>
                <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em" mb={2}>
                  Categories
                </Text>
                <VStack align="stretch" spacing={1}>
                  <Button
                    justifyContent="space-between"
                    variant="ghost"
                    size="sm"
                    fontWeight={category === 'all' ? 800 : 500}
                    bg={category === 'all' ? '#f4ece1' : 'transparent'}
                    borderRadius="lg"
                    onClick={() => dispatch(setCategory('all'))}
                  >
                    All items
                    <Badge colorScheme="gray" variant="subtle">
                      {items.length}
                    </Badge>
                  </Button>
                  {categories.map((item) => (
                    <Button
                      key={item}
                      justifyContent="space-between"
                      variant="ghost"
                      size="sm"
                      textTransform="capitalize"
                      fontWeight={category === item ? 800 : 500}
                      bg={category === item ? '#f4ece1' : 'transparent'}
                      borderRadius="lg"
                      onClick={() => dispatch(setCategory(item))}
                    >
                      {item}
                      <Badge colorScheme="gray" variant="subtle">
                        {items.filter((p) => p.category === item).length}
                      </Badge>
                    </Button>
                  ))}
                </VStack>
              </Box>

              {/* Price Range Filter */}
              <Box>
                <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em" mb={2}>
                  Price range
                </Text>
                <VStack align="stretch" spacing={2.5}>
                  {moneyRanges.map((range) => (
                    <HStack key={range.value} as="label" cursor="pointer" spacing={3}>
                      <input
                        type="radio"
                        name="price"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={() => dispatch(setPriceRange(range.value))}
                      />
                      <Text fontSize="sm" fontWeight={priceRange === range.value ? '700' : '500'}>
                        {range.label}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Customer Rating Filter */}
              <Box>
                <Text fontSize="xs" fontWeight="800" textTransform="uppercase" letterSpacing="0.1em" mb={2}>
                  Minimum rating
                </Text>
                <Select
                  value={minRating}
                  onChange={(e) => dispatch(setMinRating(Number(e.target.value)))}
                  size="md"
                  borderRadius="xl"
                  bg="#faf7f2"
                  borderColor="#e5ddd0"
                >
                  <option value={0}>Any rating</option>
                  <option value={3}>★ 3.0 stars & up</option>
                  <option value={4}>★ 4.0 stars & up</option>
                  <option value={4.5}>★ 4.5 stars & up</option>
                </Select>
              </Box>
            </VStack>
          </Box>

          {/* Product Grid Area */}
          <Box>
            {/* Top Toolbar: Result count + Sorting */}
            <Flex justify="space-between" align="center" mb={6} gap={3} wrap="wrap">
              <Text fontSize="sm" color="gray.600" fontWeight="600">
                {status === 'succeeded' ? `Showing ${products.length} products` : 'Loading catalog...'}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.500" display={{ base: 'none', sm: 'block' }} fontWeight="600">
                  Sort:
                </Text>
                <Select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => dispatch(setSort(e.target.value as SortOption))}
                  w="200px"
                  size="sm"
                  borderRadius="xl"
                  bg="white"
                  borderColor="#ded7cb"
                  fontWeight="600"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Name: A to Z</option>
                  <option value="rating-desc">Highest Rated</option>
                </Select>
              </HStack>
            </Flex>

            {/* Loading State */}
            {status === 'loading' && (
              <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={6}>
                {Array.from({ length: 6 }, (_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </SimpleGrid>
            )}

            {/* Error State */}
            {status === 'failed' && (
              <Alert status="error" borderRadius="2xl" alignItems="start" p={6}>
                <AlertIcon mt={1} />
                <Box flex="1">
                  <Text fontWeight="800" fontSize="lg">
                    We couldn't load the product collection.
                  </Text>
                  <Text fontSize="sm" mt={1} color="gray.700">
                    {error}
                  </Text>
                  <Button mt={4} size="sm" bg="red.600" color="white" onClick={() => void dispatch(loadProducts())}>
                    Try again
                  </Button>
                </Box>
              </Alert>
            )}

            {/* Success State with Products */}
            {status === 'succeeded' && products.length > 0 && (
              <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={6}>
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </SimpleGrid>
            )}

            {/* Empty State when no results match filters */}
            {status === 'succeeded' && products.length === 0 && (
              <Box
                bg="white"
                border="1px solid"
                borderColor="#e8dfd2"
                borderRadius="2xl"
                py={16}
                px={6}
                textAlign="center"
                boxShadow="0 4px 16px rgba(0,0,0,0.02)"
              >
                <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.04em">
                  No matching goods found.
                </Text>
                <Text color="gray.500" mt={2} maxW="400px" mx="auto">
                  Try adjusting your search keywords, category selection, or clearing price filters.
                </Text>
                <Button
                  mt={6}
                  onClick={() => dispatch(clearFilters())}
                  bg="graphite.900"
                  color="white"
                  borderRadius="xl"
                  _hover={{ bg: 'accent.500' }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Container>

      {/* Dedicated Feedback Section */}
      <Box bg="#eee8dc" py={{ base: 14, md: 24 }} borderTop="1px solid" borderColor="#e4dbce">
        <Container maxW="1440px" px={{ base: 4, md: 8 }}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 10, lg: 16 }} alignItems="center">
            {/* Left Column: Callout & View All Feedback button */}
            <Box>
              <Text className="eyebrow">A BETTER EXPERIENCE, TOGETHER</Text>
              <Text
                as="h2"
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="800"
                letterSpacing="-0.065em"
                lineHeight="1.05"
                mt={4}
              >
                Shopping should feel
                <br />
                a little more personal.
              </Text>
              <Text color="gray.700" mt={5} maxW="480px" lineHeight="1.8" fontSize="md">
                Have a thought about the store or our new 3D showcase? Tell us what worked, what didn't, or what you
                would love to see next. Your input shapes every detail of WELLMADE.
              </Text>

              <HStack spacing={4} mt={8} wrap="wrap">
                <Button
                  as={Link}
                  to="/feedback"
                  size="lg"
                  bg="graphite.900"
                  color="white"
                  borderRadius="xl"
                  rightIcon={<ArrowUpRight size={17} />}
                  _hover={{ bg: 'accent.500', transform: 'translateY(-2px)' }}
                  boxShadow="0 8px 20px rgba(0,0,0,0.12)"
                >
                  View All Feedback
                </Button>

                <Button
                  as="a"
                  href="#share-feedback"
                  size="lg"
                  variant="outline"
                  borderColor="#cfc5b4"
                  borderRadius="xl"
                  _hover={{ bg: '#e5ded1' }}
                >
                  Leave a Note
                </Button>
              </HStack>
            </Box>

            {/* Right Column: Feedback Form Card */}
            <Box
              id="share-feedback"
              bg="#fffefa"
              borderRadius="2xl"
              border="1px solid"
              borderColor="#e2d8c7"
              p={{ base: 6, md: 8 }}
              boxShadow="0 12px 36px rgba(0,0,0,0.04)"
            >
              <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.03em" mb={1}>
                Leave a note
              </Text>
              <Text color="gray.500" fontSize="sm" mb={6}>
                Validated with Zod & stored immediately in Redux.
              </Text>
              <FeedbackForm />
            </Box>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
