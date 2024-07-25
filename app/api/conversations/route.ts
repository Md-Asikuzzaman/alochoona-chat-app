import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  message?: string;
  messages?: MessageType[];
}

export async function GET(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<ApiResponse>> {
  const searchParams = req.nextUrl.searchParams;
  const senderId = searchParams.get("senderId") as string;
  const receiverId = searchParams.get("receiverId") as string;

  try {
    const url = new URL(req.url);
    const initialPage: any = url.searchParams.get("_initialPage");
    const limitPerPage: any = url.searchParams.get("_limitPerPage");
    const currentPage = Math.max(Number(parseInt(initialPage)) || 1, 1);

    const messages = await prisma.message.findMany({
      take: parseInt(limitPerPage),
      skip: (currentPage - 1) * parseInt(limitPerPage),
      orderBy: {
        updatedAt: "asc",
      },

      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 },
    );
  }
}
