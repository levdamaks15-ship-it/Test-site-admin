import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Проверка ключей (для отладки)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ 
        error: 'Missing Supabase environment variables',
        debug: { hasUrl: !!url, hasKey: !!key }
      }, { status: 500 });
    }

    const { data: properties, error: pError } = await supabase.from('properties').select('*');
    const { data: services, error: sError } = await supabase.from('services').select('*');
    const { data: bookings, error: bError } = await supabase.from('bookings').select('*');

    if (pError || sError || bError) {
      console.error('Supabase Error:', pError || sError || bError);
      return NextResponse.json({ 
        error: 'Supabase fetch failed', 
        details: pError?.message || sError?.message || bError?.message,
        debug_url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15) + '...'
      }, { status: 500 });
    }
      properties: properties || [],
      services: services || [],
      bookings: bookings || []
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, collection, data, id } = body;

    let result;
    if (action === 'add') {
      // Маппинг полей для бронирований (совместимость с фронтендом)
      if (collection === 'bookings') {
        const dbData = {
          id: data.id || Math.random().toString(36).substr(2, 9),
          service_id: data.serviceId || data.propertyId,
          service_name: data.serviceName || data.propertyName,
          client_name: data.clientName,
          client_email: data.clientEmail,
          booking_date: data.date,
          status: data.status || 'pending',
          price: data.price
        };
        result = await supabase.from('bookings').insert(dbData);
      } else {
        result = await supabase.from(collection).insert(data);
      }
    } else if (action === 'update') {
      result = await supabase.from(collection).update(data).eq('id', id || data.id);
    } else if (action === 'delete') {
      result = await supabase.from(collection).delete().eq('id', id);
    }

    if (result?.error) throw result.error;

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
