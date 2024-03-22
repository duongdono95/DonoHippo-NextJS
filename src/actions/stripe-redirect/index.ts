"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { StripeRedirect } from "./schema";

import { db } from "@/libs/db";
import { absoluteUrl } from "@/libs/utils";
import { stripe } from "@/libs/stripe";
import { ListingInterface } from "@prisma/client";


export const stripeRedirect = async (data: {
  amount: number;
  userId: string;
  items: ListingInterface[];
}) => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = "";
  const convertedItems = data.items.map((item) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: item.name,
        description: item.description,
      },
      unit_amount: item.price,
    },
    quantity: 1,
  }))
  try {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Taskify Pro",
                description: "Unlimited boards for your organization"
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
      });

      url = stripeSession.url || "";

  } catch {
    return {
      error: "Something went wrong!"
    }
  };

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

