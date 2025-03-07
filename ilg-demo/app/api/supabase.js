import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);


export const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('instruments').select('*');
  
      // Checks for errors
      if (error) {
        console.error('Error fetching: ', error);
        window.alert("No events founi") // Console log for debugging
        throw error; // Throw the error to trigger useQuery's onError
      }
      
      // Check if there are no events
      if (!data || data.length === 0) {
        window.alert("Nothing found in table")
        console.log('No events found in the database'); // Console log for debugging
        return [];
      }
  
      // Grab data
      console.log('Fetched Events:', data);
      window.alert('Events fetched successfully');
      return data;
  
    } catch (error) {
      console.error('Unexpected Error:', error); // Console log for debugging
      throw error; // Throw unexpected errors to trigger useQuery's onError
    }
  };


