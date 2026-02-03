
import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = 'https://fpykqpprbzqbvedwugap.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweWtxcHByYnpxYnZlZHd1Z2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYyMzU5NiwiZXhwIjoyMDg1MTk5NTk2fQ.k0H5V2QvlLjrumI2m9KPPTH_jBR_0fToOijHyySAU4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixProfile() {
    const email = 'pharma@pharma.com';
    console.log(`Fixing profile for: ${email}...`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('User NOT found! Can verify password update worked?');
        return;
    }

    console.log(`Found User ID: ${user.id}`);

    // 2. Insert Profile (upsert to be safe)
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id, // Assuming 'id' is the PK and matches auth.users.id (standard Supabase)
            user_id: user.id, // Redundant but sometimes used depending on schema
            first_name: 'Pharmacist',
            last_name: 'Admin',
            role: 'pharmacist'
        }, { onConflict: 'id' });

    // Note: If schema is different (e.g. only 'id' linking to auth.users), this might need adjustment.
    // Based on previous reads, schema seems to have 'id' as PK UUID ref profiles(id).
    // Wait, let's double check if my schema assumption is right.
    // Standard Supabase starter: profiles.id references auth.users.id.
    // Let's try inserting with just `id` first if `user_id` column doesn't exist.
    // Actually, let's just inspect the schema if this fails?
    // No, standard is id. I will try to insert a safe payload.
}

async function fixProfileStandard() {
    const email = 'pharma@pharma.com';
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) return;

    // Based on previous code in Verified Payment:
    // .from("profiles").select("role").eq("user_id", session.user.id)
    // AH! It uses `user_id` column?
    // Let's look at `AuthPage.tsx`: .eq('id', session.user.id)
    // Wait.
    // Line 63 in AuthPage.tsx: .eq('id', session.user.id)
    // ProtectedRoute.tsx: .eq('user_id', session.user.id)

    // CONTRADICTION FOUND.
    // AuthPage: .eq('id', session.user.id)
    // ProtectedRoute: .eq('user_id', session.user.id)

    // One of them is likely wrong OR the table has both, where id=user_id.
    // If ProtectedRoute uses `user_id`, and I insert without it...
    // Let's try to upsert with BOTH if possible, or just standard.

    // Let's insert based on what `create-pharmacist.js` did (from memory/history).
    // It likely failed because it didn't match the schema or trigger failed.

    // I will try to update using a robust query.

    const payload = {
        id: user.id,
        user_id: user.id, // REQUIRED by schema
        first_name: 'Pharmacist',
        last_name: 'Admin',
        role: 'pharmacist'
    }

    // 2. Profile exists (based on error), so let's UPDATE it.
    console.log("Profile exists. Updating role...");

    // We must query by user_id to find the row to update
    const { error } = await supabase
        .from('profiles')
        .update({ role: 'pharmacist', first_name: 'Pharmacist', last_name: 'Admin' })
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
    } else {
        console.log('Profile updated successfully.');
    }
}

fixProfileStandard();
