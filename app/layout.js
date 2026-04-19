import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

// next/font โหลด font ไว้ล่วงหน้าพร้อมกับ HTML → ไม่มี FOUC
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata = {
  title: "Are You Burned Out? — แบบประเมินความหมดไฟ",
  description:
    "แบบประเมินความ Burnout ง่าย ๆ ใน 6 ข้อ เพื่อดูว่าคุณกำลังหมดไฟหรือไม่ พร้อมคำแนะนำในการดูแลตัวเอง",
  keywords: ["burnout", "หมดไฟ", "ประเมิน", "สุขภาพจิต", "mental health"],
  openGraph: {
    title: "Are You Burned Out? — แบบประเมินความหมดไฟ",
    description:
      "แบบประเมินความ Burnout ง่าย ๆ ใน 6 ข้อ เพื่อดูว่าคุณกำลังหมดไฟหรือไม่",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body>{children}</body>
    </html>
  );
}
