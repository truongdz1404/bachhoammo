import { redirect } from "next/navigation";

export default function Page() {
  const shopId = "1";
  const currentStep = 1;
  
  redirect(`/shop/registration/${shopId}/${currentStep}`);
}
