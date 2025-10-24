export default async function Page({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  return <>This is the statistics page for shop ID: {shopId}</>;
}
