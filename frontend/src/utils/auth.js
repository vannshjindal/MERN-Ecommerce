const fetchUserDetails = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user-details', {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json(); 
      console.log('Fetched user data:', data);
  
      if (data.success) {
        
        return data.user;
      } else {
        return null;  
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      return null;  
    }
  };
  
  export default fetchUserDetails;
  
