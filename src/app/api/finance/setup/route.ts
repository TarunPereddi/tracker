import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import FinanceSetup from '@/lib/schemas/FinanceSetup';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    // Get the single finance setup document
    let setup = await FinanceSetup.findOne();
    
    // If no setup exists, create a default one
    if (!setup) {
      setup = await FinanceSetup.create({
        salarySources: [],
        emis: [],
        recurringBills: [],
        cards: [],
        investments: [],
        properties: [],
        moneyLent: [],
        moneyBorrowed: []
      });
    }

    return NextResponse.json({ ok: true, setup });
  } catch (error) {
    console.error('Finance Setup GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch finance setup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Finance Setup POST payload:', payload);

    // Update or create the single finance setup document
    const setup = await FinanceSetup.findOneAndUpdate(
      {},
      { $set: payload },
      { upsert: true, new: true }
    );

    console.log('Finance setup saved:', setup);
    return NextResponse.json({ ok: true, setup });
  } catch (error) {
    console.error('Finance Setup POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to save finance setup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
