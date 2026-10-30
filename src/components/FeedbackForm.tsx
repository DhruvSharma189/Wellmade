import { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppDispatch } from '../app/hooks';
import { addFeedback } from '../features/feedback/feedbackSlice';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter at least 2 characters.')
    .max(70, 'Name must be 70 characters or fewer.'),
  email: z.string().trim().email('Enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please share at least 10 characters.')
    .max(1200, 'Feedback must be 1,200 characters or fewer.'),
});

type FormValues = z.infer<typeof schema>;

export function FeedbackForm() {
  const dispatch = useAppDispatch();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const onSubmit = async (values: FormValues) => {
    setSuccess(false);
    dispatch(
      addFeedback({
        id: crypto.randomUUID(),
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        createdAt: new Date().toISOString(),
      }),
    );
    reset();
    setSuccess(true);
  };

  return (
    <Box>
      {success && (
        <Alert status="success" borderRadius="xl" mb={5}>
          <AlertIcon />
          Thanks for sharing. Your feedback is saved in this browser.
        </Alert>
      )}
      <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel fontSize="sm" fontWeight="650">
              Your name
            </FormLabel>
            <Input
              placeholder="e.g. Alex Morgan"
              bg="white"
              borderColor="blackAlpha.200"
              {...register('name')}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            <FormErrorMessage id="name-error">{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel fontSize="sm" fontWeight="650">
              Email address
            </FormLabel>
            <Input
              type="email"
              placeholder="alex@example.com"
              bg="white"
              borderColor="blackAlpha.200"
              {...register('email')}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.message} isRequired>
            <FormLabel fontSize="sm" fontWeight="650">
              Your feedback
            </FormLabel>
            <Textarea
              placeholder="Tell us what worked, what didn't, or what you'd love to see next..."
              rows={5}
              resize="vertical"
              bg="white"
              borderColor="blackAlpha.200"
              {...register('message')}
            />
            <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Sending"
            bg="graphite.900"
            color="white"
            h="52px"
            _hover={{ bg: 'graphite.700' }}
          >
            Submit feedback ↗
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
