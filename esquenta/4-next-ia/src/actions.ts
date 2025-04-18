"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const apiKey = formData.get("apiKey") as string;

  const cookiesStore = await cookies();
  cookiesStore.set("apiKey", apiKey);

  redirect("/faturas");
}

export async function logout(){
    const cookiesStore = await cookies();
    cookiesStore.delete("apiKey");
    
    redirect("/login");
}

export async function createFaturas(){
  //fetch
  revalidateTag("faturas");
}