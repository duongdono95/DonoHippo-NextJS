'use client';
import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  return <div>PaymentForm</div>;
};

export default PaymentForm;
