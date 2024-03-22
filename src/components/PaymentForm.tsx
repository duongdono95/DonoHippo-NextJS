'use client';
import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  return <div>PaymentForm</div>;
};

export default PaymentForm;
