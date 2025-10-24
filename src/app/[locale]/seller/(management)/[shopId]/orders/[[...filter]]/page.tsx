export default async function Page({
  params,
}: {
  params: Promise<{ shopId: string; filter?: string[] }>;
}) {
  const { shopId, filter } = await params;
  return (
    <>
      This is the order page for shop ID: {shopId} with filters:{" "}
      {filter?.join(", ")}
    </>
  );
}
