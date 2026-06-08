import "server-only";

import { cacheLife } from "next/cache";

export async function getCurrentYear() {
  "use cache";
  cacheLife("daily");

  return new Date().getFullYear();
}

export async function getCurrentDatePtBr() {
  "use cache";
  cacheLife("daily");

  return new Date().toLocaleDateString("pt-BR");
}
