"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOGIN_URL } from "../constant";

export async function loginServerAction(formData: FormData) {
  const apiKey = formData.get("apiKey");
  console.log(apiKey);
  const response = await fetch(LOGIN_URL, {
    headers: {
      "X-API-KEY": apiKey as string,
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Invalid API Key");
  }

  const cookiesStore = await cookies();
  cookiesStore.set("apiKey", apiKey as string);

  redirect("/invoices");
}

export async function logoutServerAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete("apiKey");
  redirect("/login");
}