import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PageContent from '@/models/PageContent';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    await dbConnect();
    let doc = await PageContent.findOne({ pageId }).lean();
    if (!doc) {
      return NextResponse.json({ content: {} });
    }
    return NextResponse.json(doc);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const body = await req.json();
    await dbConnect();
    const doc = await PageContent.findOneAndUpdate(
      { pageId },
      { content: body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    return NextResponse.json(doc);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
