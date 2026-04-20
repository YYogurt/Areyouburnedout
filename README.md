# ✨ ดาวระบาย — Star Venting

เว็บไซต์สำหรับระบายความรู้สึก ข้อความจะกลายเป็นดาวบนท้องฟ้า

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **MongoDB** (Mongoose)
- **Vercel** (Deployment)

---

## 🔧 วิธี Setup & Test แบบ Local

### 1. สร้าง MongoDB Atlas (ฟรี)
1. ไปที่ [mongodb.com/atlas](https://www.mongodb.com/atlas) → สร้าง account ฟรี
2. สร้าง **Free Cluster** (M0 tier, เลือก region Singapore)
3. สร้าง **Database User** (จำ username + password ไว้)
4. ตั้ง **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. กดปุ่ม **Connect** → เลือก **Drivers** → copy connection string

### 2. ตั้งค่า Environment Variable
```bash
# copy template
cp .env.example .env.local

# แก้ไข .env.local ใส่ connection string
# ตัวอย่าง:
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/star-venting?retryWrites=true&w=majority
```

### 3. ติดตั้ง Dependencies
```bash
npm install
```

### 4. รัน Development Server
```bash
npm run dev
```

### 5. เปิดเบราว์เซอร์
- ไปที่ [http://localhost:3000](http://localhost:3000) — หน้า Dashboard (ท้องฟ้าดวงดาว)
- ไปที่ [http://localhost:3000/write](http://localhost:3000/write) — หน้าเขียนข้อความ

### 6. ทดสอบ
1. ไปหน้า `/write` → พิมพ์ข้อความ → กดส่ง
2. ระบบจะ redirect กลับไปหน้า Dashboard
3. จะเห็นดาวดวงใหม่ปรากฏขึ้นบนท้องฟ้า
4. Hover ดาว → เห็น preview ข้อความ
5. Click ดาว → เห็นข้อความเต็ม + healing quote

---

## 🚀 Deploy ขึ้น Vercel

### วิธี Deploy
1. Push code ขึ้น GitHub
2. ไปที่ [vercel.com](https://vercel.com) → Import Git Repository
3. เลือก repo → Vercel จะ detect Next.js อัตโนมัติ

### ตั้ง Environment Variable บน Vercel
1. เข้า Project Dashboard → **Settings** tab
2. คลิก **Environment Variables** ในเมนูซ้าย
3. กรอก:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://...` (connection string ของคุณ)
4. ติ๊กเลือก: ✅ Production ✅ Preview ✅ Development
5. กด **Save**
6. กด **Redeploy** เพื่อให้มีผล

---

## 📁 Project Structure

```
app/
├── api/messages/route.ts    # API: GET (ดึง 30 ล่าสุด) + POST (สร้างใหม่)
├── globals.css              # Theme + animations
├── layout.tsx               # Root layout
├── page.tsx                 # Dashboard (Star field)
└── write/page.tsx           # เขียนข้อความ

components/
├── MessageModal.tsx         # Modal แสดงข้อความ
├── Navbar.tsx               # Navigation bar
├── ParticleBackground.tsx   # Background particles + shooting stars
├── StarField.tsx            # Container สำหรับดาว
├── StarItem.tsx             # ดาวแต่ละดวง
└── WriteForm.tsx            # Form เขียนข้อความ

lib/
├── models/Message.ts        # Mongoose schema
└── mongodb.ts               # DB connection singleton
```

---

## ⚠️ หมายเหตุ
- แบบประเมินนี้ไม่ใช่การวินิจฉัยทางการแพทย์
- สายด่วนสุขภาพจิต: **1323** (ให้บริการ 24 ชั่วโมง)
