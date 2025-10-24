export default async function Page({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  return <>This is the management page for shop ID: {shopId}</>;
}
