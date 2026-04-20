import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/Message";

// Star color palette — warm healing colors
const STAR_COLORS = [
  "#fbbf24", // golden
  "#f59e0b", // amber
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#f472b6", // pink
  "#34d399", // emerald
  "#fb923c", // orange
  "#818cf8", // indigo
  "#e879f9", // fuchsia
  "#fcd34d", // yellow
];

/**
 * GET /api/messages
 * ดึง 30 ข้อความล่าสุด
 */
export async function GET() {
  try {
    await dbConnect();

    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ success: true, data: messages }, { status: 200 });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to fetch data" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * สร้างข้อความใหม่
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { nickname, content } = body;

    // Validate
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a message" },
        { status: 400 }
      );
    }

    if (content.trim().length > 280) {
      return NextResponse.json(
        { success: false, error: "Message must be 280 characters or less" },
        { status: 400 }
      );
    }

    if (nickname && nickname.length > 30) {
      return NextResponse.json(
        { success: false, error: "Nickname must be 30 characters or less" },
        { status: 400 }
      );
    }

    // Generate random star properties
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    const starSize = 20 + Math.floor(Math.random() * 30); // 20-50px
    const posX = 5 + Math.floor(Math.random() * 90); // 5-95% (avoid edges)
    const posY = 10 + Math.floor(Math.random() * 75); // 10-85% (avoid edges)

    const message = await Message.create({
      nickname: nickname?.trim() || "",
      content: content.trim(),
      color,
      starSize,
      posX,
      posY,
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save message" },
      { status: 500 }
    );
  }
}
