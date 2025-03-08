import { createClient, setAuth } from '@supabase/supabase-js';
import { Sign } from 'crypto';

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);



export const fetchLeads = async () => {
    
  
  
  try {
      const {  data, error } = await supabase.from('2025MAYLEADS').select('*');


      // Checks for errors
      if (error) {
        console.error('Error fetching: ', error);
        window.alert("No leads found") // Console log for debugging
        throw error; // Throw the error to trigger useQuery's onError
      }
      
      // Check if there are no events
      if (!data || data.length === 0) {
        window.alert("Nothing found in table")
        console.log('No leads found in the database'); // Console log for debugging
        return [];
      }
  
      // Grab data
      console.log('Fetched Leads:', data);
      window.alert('Leads fetched successfully');
      return data;
  
    } catch (error) {
      console.error('Unexpected Error:', error); // Console log for debugging
      throw error; // Throw unexpected errors to trigger useQuery's onError
    }
  };


