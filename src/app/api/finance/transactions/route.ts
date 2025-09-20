import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Transaction from '@/lib/schemas/Transaction';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: any = {};
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ ok: true, transactions });
  } catch (error) {
    console.error('Transactions GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Transaction POST payload:', payload);
    
    // Validate required fields
    if (!payload.date || !payload.type || !payload.amount || !payload.category) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: date, type, amount, category' 
      }, { status: 400 });
    }

    // Ensure amount is a number
    payload.amount = Number(payload.amount);
    
    if (isNaN(payload.amount)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Amount must be a valid number' 
      }, { status: 400 });
    }

    const transaction = await Transaction.create(payload);
    console.log('Transaction created:', transaction);
    
    return NextResponse.json({ ok: true, transaction });
  } catch (error) {
    console.error('Transaction POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
