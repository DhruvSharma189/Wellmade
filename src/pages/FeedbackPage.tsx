import { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ArrowLeft, ArrowUpRight, MessageCircle, MessageSquare, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { FeedbackForm } from '../components/FeedbackForm';

export function FeedbackPage() {
  const entries = useAppSelector((state) => state.feedback.entries);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter((e) =>
    searchTerm.trim() === ''
      ? true
      : e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="1280px" px={{ base: 4, md: 8 }} py={{ base: 8, md: 14 }}>
      {/* Back Link */}
      <Button as={Link} to="/" variant="ghost" leftIcon={<ArrowLeft size={16} />} mb={8} borderRadius="xl">
        Back to collection
      </Button>

      {/* Hero Banner */}
      <Box
        bg="graphite.900"
        color="white"
        borderRadius="2xl"
        p={{ base: 6, md: 12 }}
        mb={10}
        position="relative"
        overflow="hidden"
        boxShadow="0 16px 40px rgba(0,0,0,0.2)"
      >
        <Box className="feedback-glow" />
        <Box position="relative">
          <HStack spacing={2} mb={2}>
            <Sparkles size={14} color="#d47757" />
            <Text className="eyebrow" color="accent.500">
              THE COMMUNITY BOARD
            </Text>
          </HStack>
          <Text
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="800"
            letterSpacing="-0.075em"
            lineHeight="1"
            mt={2}
          >
            A place to be heard.
          </Text>
          <Text color="whiteAlpha.750" mt={4} maxW="580px" lineHeight="1.8" fontSize="md">
            Every note, suggestion, and reflection helps shape what comes next for WELLMADE. Read notes from fellow
            customers or leave your own below.
          </Text>

          <HStack mt={7} spacing={3}>
            <Box bg="accent.500" color="graphite.900" p={3} borderRadius="xl">
              <MessageCircle size={24} />
            </Box>
            <Box>
              <Text fontSize="2xl" fontWeight="800" lineHeight="1">
                {entries.length}
              </Text>
              <Text color="whiteAlpha.600" fontSize="xs" mt={1}>
                {entries.length === 1 ? 'Community Note' : 'Community Notes'} Recorded
              </Text>
            </Box>
          </HStack>
        </Box>
      </Box>

      {/* Persistence Architecture Notice */}
      <Alert status="info" borderRadius="xl" mb={10} bg="#f4ede2" border="1px solid" borderColor="#e2d6c3" color="graphite.900">
        <AlertIcon color="#d47757" />
        <Box fontSize="xs" lineHeight="1.6">
          <Text fontWeight="700">Storage Architecture Note:</Text>
          <Text color="gray.700">
            Feedback is stored in centralized Redux state and preserved in your browser's localStorage. Full page
            refreshes retain your submissions on this device. Real-time multi-user synchronization requires an active
            backend database endpoint.
          </Text>
        </Box>
      </Alert>

      {/* Main Content: Notes List + Submission Card */}
      <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="start">
        {/* Left: Community Notes Listing */}
        <Box flex="1" w="100%">
          <Flex
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            mb={6}
            gap={3}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Box>
              <Text as="h2" fontSize="2xl" fontWeight="800" letterSpacing="-0.04em">
                Community Notes ({filteredEntries.length})
              </Text>
              <Text color="gray.500" fontSize="xs">
                Ordered chronologically (newest first)
              </Text>
            </Box>

            {/* Quick Filter */}
            <Box position="relative" maxW={{ base: '100%', sm: '240px' }} w="100%">
              <Box position="absolute" left={3} top="10px" color="gray.400">
                <Search size={14} />
              </Box>
              <Input
                placeholder="Search notes..."
                size="sm"
                borderRadius="xl"
                pl={9}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                borderColor="#dfd7cb"
              />
            </Box>
          </Flex>

          {filteredEntries.length === 0 ? (
            <Box
              bg="white"
              border="1px solid"
              borderColor="#e7dfd2"
              borderRadius="2xl"
              textAlign="center"
              py={16}
              px={6}
              boxShadow="0 4px 16px rgba(0,0,0,0.02)"
            >
              <Box display="inline-flex" p={4} bg="#f5efe6" borderRadius="full" mb={4} color="graphite.600">
                <MessageSquare size={26} />
              </Box>
              <Text fontSize="xl" fontWeight="800">
                {searchTerm ? 'No matching notes found' : 'It’s quiet in here'}
              </Text>
              <Text color="gray.500" mt={2} maxW="360px" mx="auto" fontSize="sm">
                {searchTerm
                  ? 'Try searching with another name or keyword.'
                  : 'Be the first to leave a note. Your feedback is immediately visible and cherished.'}
              </Text>
              <Button
                as="a"
                href="#share-feedback"
                mt={5}
                size="sm"
                rightIcon={<ArrowUpRight size={14} />}
                bg="graphite.900"
                color="white"
                borderRadius="xl"
                _hover={{ bg: 'accent.500' }}
              >
                Share your thoughts
              </Button>
            </Box>
          ) : (
            <VStack align="stretch" spacing={4}>
              {filteredEntries.map((entry) => (
                <Box
                  key={entry.id}
                  bg="white"
                  border="1px solid"
                  borderColor="#e7ded0"
                  borderRadius="2xl"
                  p={{ base: 5, md: 6 }}
                  boxShadow="0 2px 10px rgba(0,0,0,0.02)"
                  transition="all 0.2s ease"
                  _hover={{ borderColor: '#d47757', boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}
                >
                  <HStack align="start" spacing={4}>
                    <Avatar
                      name={entry.name}
                      size="md"
                      bg="graphite.100"
                      color="graphite.800"
                      fontWeight="700"
                      border="1px solid"
                      borderColor="#dfd4c5"
                    />
                    <Box flex="1">
                      <Flex
                        align={{ base: 'start', sm: 'center' }}
                        justify="space-between"
                        gap={2}
                        direction={{ base: 'column', sm: 'row' }}
                      >
                        <HStack spacing={2}>
                          <Text fontWeight="800" fontSize="md">
                            {entry.name}
                          </Text>
                          <Badge fontSize="10px" colorScheme="orange" variant="subtle" borderRadius="full" px={2}>
                            Customer
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.400">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </Flex>
                      <Text color="gray.700" lineHeight="1.8" mt={3} whiteSpace="pre-wrap" fontSize="sm">
                        {entry.message}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Right: Feedback Submission Form Card */}
        <Box
          id="share-feedback"
          w={{ base: '100%', lg: '420px' }}
          flexShrink={0}
          bg="#efeae0"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          border="1px solid"
          borderColor="#e3dacb"
          boxShadow="0 8px 24px rgba(0,0,0,0.04)"
        >
          <Text className="eyebrow">YOUR TURN</Text>
          <Text fontSize="2xl" fontWeight="800" letterSpacing="-0.04em" mt={1}>
            Leave a note.
          </Text>
          <Text color="gray.600" fontSize="sm" mt={1} mb={6} lineHeight="1.6">
            A thought, a feature suggestion, or an idea for our collection.
          </Text>
          <FeedbackForm />
        </Box>
      </Flex>
    </Container>
  );
}
