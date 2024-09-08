import prisma from "@/config/db";
import { NextRequest, NextResponse } from "next/server";

interface ApiResponse {
  message?: string;
  users?: UserType[];
}

export async function GET(
  req: Request,
  res: Response,
): Promise<NextResponse<ApiResponse>> {
  try {
    const url = new URL(req.url);

    const initialPage: any = url.searchParams.get("_initialPage");
    const limitPerPage: any = url.searchParams.get("_limitPerPage");

    const currentPage = Math.max(Number(parseInt(initialPage)) || 1, 1);

    const users = await prisma.user.findMany({
      take: parseInt(limitPerPage),
      skip: (currentPage - 1) * parseInt(limitPerPage),
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  res: NextResponse,
): Promise<NextResponse<ApiResponse>> {
  try {
    const { username, email, password } = await req.json();

    // check if the user is existing
    const isUserExisting = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExisting) {
      return NextResponse.json(
        { message: "user already exist!" },
        { status: 500 },
      );
    }

    const isNameTaken = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (isNameTaken) {
      return NextResponse.json(
        { message: "username already taken!" },
        { status: 500 },
      );
    }

    await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return NextResponse.json({ message: "user created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "someting went wrong!",
      },
      { status: 500 },
    );
  }
}
