import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Header } from "./_components/header";

export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);

  return (
    <div className="min-h-screen">
      <Header isSticky={true} />
      <main
        className="container mx-auto px-4 py-8"
        style={{ minHeight: "1000vh" }}
      >
        <h1 className="text-3xl font-bold text-center">
          Chào mừng đến với BachHoaMMO
        </h1>
        <p className="text-center text-muted-foreground mt-4">
          Nền tảng mua sắm trực tuyến hàng đầu
        </p>
        <div className="mt-8 text-center text-muted-foreground">
          <p>Cuộn xuống để kiểm tra header sticky...</p>
          <p className="mt-4 text-sm">
            💡 Để tắt sticky header, sử dụng:{" "}
            <code className="bg-muted px-2 py-1 rounded">
              {"<Header isSticky={false} />"}
            </code>
          </p>
        </div>
      </main>
    </div>
  );
}

// import { auth } from "@/auth";
// import SignIn from "@/components/auth/signin";
// import SignOut from "@/components/auth/signout";
// import { apiClient } from "@/lib/api-client";

// export default async function Home() {
//   const session = await auth();
//   if (session) {
//     const req = await apiClient("samples/hello");
//     const res = await req.text();
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <p>
//           Welcome back, <strong>{session.user?.name}</strong>! {res}
//         </p>
//         <SignOut className="ml-2" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//       <SignIn />
//     </div>
//   );
// }
