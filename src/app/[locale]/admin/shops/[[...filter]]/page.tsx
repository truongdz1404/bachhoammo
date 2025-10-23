export default async function Page({
  params,
}: {
  params: Promise<{ filter?: string[] }>;
}) {
  const { filter } = await params;
  return <>This is the admin page with filter: {filter?.join(", ")}</>;
}
