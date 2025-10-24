import WithdrawalPage from "@/app/[locale]/withdrawal/_components/withdrawal-page";

export default function page() {
  return (
    <div>
      <WithdrawalPage params={{ locale: "en" }} />
    </div>
  )
}
