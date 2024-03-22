'use server';

import { auth, currentUser } from '@clerk/nextjs';
import { absoluteUrl } from '@/libs/utils';
import { stripe } from '@/libs/stripe';
import { ListingInterface } from '@prisma/client';

export const stripeRedirect = async (data: { subTotal: number; userId: string; items: ListingInterface[] }) => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: 'Unauthorized',
    };
  }

  const settingsUrl = absoluteUrl(`/`);

  let url = '';
  const convertedItems = data.items.map(item => ({
    price_data: {
      currency: 'USD',
      product_data: {
        name: item.name,
        description: item.description,
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'payment',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: convertedItems,
      metadata: {
        userId,
      },
    });
    console.log(stripeSession);
    url = stripeSession.url || '';
  } catch (e) {
    console.log(e);
    return {
      error: 'Something went wrong!',
    };
  }
  return { data: url };
};
