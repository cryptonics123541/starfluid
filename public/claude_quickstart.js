const fetchAnthropicResponse = async () => {
    try {
      // Replace with the actual prompt/question you want to send
      const prompt = "Why is the ocean salty?";
  
      // Make a POST request to your Vercel API endpoint
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // Sending the prompt as the request body
      });
  
      // Parse the response from the API
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Log the response for debugging
      console.log("Response from API:", data);
    } catch (error) {
      // Handle errors
      console.error("Error fetching response from API:", error);
    }
  };
  
  // Call the function to test
  fetchAnthropicResponse();
  