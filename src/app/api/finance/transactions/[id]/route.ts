import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Transaction from '@/lib/schemas/Transaction';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ ok: false, error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, transaction });
  } catch (error) {
    console.error('Transaction GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Transaction PUT payload:', payload);
    
    // Ensure amount is a number
    if (payload.amount) {
      payload.amount = Number(payload.amount);
      if (isNaN(payload.amount)) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Amount must be a valid number' 
        }, { status: 400 });
      }
    }

    const transaction = await Transaction.findByIdAndUpdate(
      params.id,
      { $set: payload },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ ok: false, error: 'Transaction not found' }, { status: 404 });
    }

    console.log('Transaction updated:', transaction);
    return NextResponse.json({ ok: true, transaction });
  } catch (error) {
    console.error('Transaction PUT error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const transaction = await Transaction.findByIdAndDelete(params.id);

    if (!transaction) {
      return NextResponse.json({ ok: false, error: 'Transaction not found' }, { status: 404 });
    }

    console.log('Transaction deleted:', transaction);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Transaction DELETE error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
