import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { HomePage } from '../pages/HomePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products/:productId', element: <ProductDetailsPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
