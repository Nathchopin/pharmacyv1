
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = 'https://fpykqpprbzqbvedwugap.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweWtxcHByYnpxYnZlZHd1Z2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYyMzU5NiwiZXhwIjoyMDg1MTk5NTk2fQ.k0H5V2QvlLjrumI2m9KPPTH_jBR_0fToOijHyySAU4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkUserRole() {
    const email = 'pharma@pharma.com';
    console.log(`Checking role for: ${email}...`);

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('User NOT found!');
        return;
    }

    console.log('User found. Check profiles table...');

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError);
    } else {
        console.log('Profile found:', profile);
        if (profile.role !== 'pharmacist') {
            console.warn(`WARNING: Role is '${profile.role}', expected 'pharmacist'.`);
        } else {
            console.log('SUCCESS: Role is correctly set to pharmacist.');
        }
    }
}

checkUserRole();
