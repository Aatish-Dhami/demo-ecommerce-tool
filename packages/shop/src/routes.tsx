import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  HomePage,
  ProductPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
} from './pages';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product/:id',
        element: <ProductPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'order-confirmation',
        element: <OrderConfirmationPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
