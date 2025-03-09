import { createClient, setAuth } from '@supabase/supabase-js';


// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);



export const fetchLeads = async () => {
  try {
    const cachedLeads = localStorage.getItem('cachedLeads');

    if (cachedLeads) {
        console.log("Using cached data");
        return JSON.parse(cachedLeads);
    }

    const { data, error } = await supabase
        .from('2025MAYLEADS')
        .select('employer_name, carrier_name, employer_city, policy_number, policy_effective_date, policy_expiration_date, agency_city');

    // Checks for errors
    if (error) {
        console.error('Error fetching: ', error);
        window.alert("No leads found");
        throw error;
    }

    // Check if there are no events
    if (!data || data.length === 0) {
        window.alert("Nothing found in table");
        console.log('No leads found in the database');
        return [];
    }

    // Cache the fetched data
    localStorage.setItem('cachedLeads', JSON.stringify(data));

    window.alert('Leads fetched successfully');
    return data;

} catch (error) {
    console.error('Unexpected Error:', error);
    throw error;
}
}



