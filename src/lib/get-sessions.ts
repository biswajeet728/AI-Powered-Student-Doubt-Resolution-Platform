import { headers, cookies } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const getServerSession = cache(async () => {
  const headerStore = await headers();
  const cookieStore = await cookies();

  return await auth.api.getSession({
    headers: new Headers({
      ...Object.fromEntries(headerStore.entries()),
      cookie: cookieStore.toString(),
    }),
  });
});
