import { getLooks } from "@/lib/looks"
import ClientPage from "./page.client"

export const dynamic = "force-dynamic"

export default async function Page() {
  const looks = await getLooks()

  return <ClientPage looks={looks} />
}
