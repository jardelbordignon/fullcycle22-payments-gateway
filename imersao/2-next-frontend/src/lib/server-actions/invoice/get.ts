"use server"

import { cookies } from "next/headers";
import { INVOICE_URL } from "../constant";

export async function getInvoiceServerAction(id: string) {
  const cookiesStore = await cookies();
  const apiKey = cookiesStore.get("apiKey")?.value;

  const response = await fetch(`${INVOICE_URL}/${id}`, {
    headers: {
      "X-API-KEY": apiKey as string,
    },
    cache: 'force-cache',
    next: {
      tags: [`accounts/${apiKey}/invoices/${id}`]
    }
  });
  
  return response.json();
}