const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wyizmlzrjejrzyhdkvry.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aXptbHpyamVqcnp5aGRrdnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzA2MzYsImV4cCI6MjA5MTg0NjYzNn0.H4b0UPsUPeuxH-iIZzJ3-qYFYILKu4KyiPjeGY_8Ie0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('--- Fetching bookings ---');
  const { data, error } = await supabase.from('bookings').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Bookings in DB:', data);
  
  if (data.length > 0) {
    const firstId = data[0].id;
    console.log(`Trying to delete ${firstId}...`);
    const { error: dError } = await supabase.from('bookings').delete().eq('id', firstId);
    if (dError) {
      console.error('Delete error:', dError);
    } else {
      console.log('Delete command successful (check if row is gone)');
    }
  }
}

check();
