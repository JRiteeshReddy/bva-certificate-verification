import { NextResponse } from 'next/server';
import Papa from 'papaparse';

const SHEET_URL = process.env.GOOGLE_SHEET_CSV_URL || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
  }

  // Use dummy URL if not provided for development
  const targetUrl = SHEET_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-PLACEHOLDER/pub?output=csv';

  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    
    // If SHEET_URL is not set and the fetch fails, return mock data
    if (!SHEET_URL || !response.ok) {
      if (!SHEET_URL) console.warn('GOOGLE_SHEET_CSV_URL not set, using mock data.');
      
      const mockData = [
        { id: 'BVA-2024-001', names: 'John Doe, Jane Smith', event: 'Hackvibe 2024', position: '1st', date: '2024-05-11' },
        { id: 'BVA-2024-002', names: 'Alice Johnson', event: 'CodeBlitz', position: '2nd', date: '2024-04-15' },
      ];
      
      const record = mockData.find(r => r.id === id);
      if (record) return NextResponse.json(record);
      return NextResponse.json({ error: 'Invalid Certificate ID' }, { status: 404 });
    }

    const csvText = await response.text();
    
    // Use PapaParse for robust parsing
    const { data } = Papa.parse<string[]>(csvText, {
      skipEmptyLines: true,
    });

    if (data.length === 0) {
      throw new Error('Sheet is empty');
    }

    const headers = data[0].map(h => h.trim().toLowerCase());
    
    // Mapping headers to indices
    const idIndex = headers.findIndex(h => h.includes('id'));
    const namesIndex = headers.findIndex(h => h.includes('member') || h.includes('name'));
    const eventIndex = headers.findIndex(h => h.includes('event'));
    const positionIndex = headers.findIndex(h => h.includes('position'));
    const dateIndex = headers.findIndex(h => h.includes('date'));

    if (idIndex === -1) {
      throw new Error('Certificate ID column not found in sheet');
    }

    const record = data.slice(1).find(row => row[idIndex]?.trim() === id.trim());

    if (record) {
      // Format date from YYYY-MM-DD to DD-MM-YYYY if applicable
      let formattedDate = record[dateIndex] || 'N/A';
      if (formattedDate.includes('-')) {
        const parts = formattedDate.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      return NextResponse.json({
        id: record[idIndex],
        names: record[namesIndex] || 'N/A',
        event: record[eventIndex] || 'N/A',
        position: record[positionIndex] || 'N/A',
        date: formattedDate,
      });
    }

    return NextResponse.json({ error: 'Invalid Certificate ID' }, { status: 404 });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
