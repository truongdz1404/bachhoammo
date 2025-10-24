export default async function Page({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  return <>This is the chat support page for shop ID: {shopId}</>;
}
