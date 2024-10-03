export class LORANCalculator {
    // Constructor to initialize the API URL
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
    }
  
    // Method to calculate Loran data by sending points to the API
    async calculateLoranData(points) {
      try {
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(points),
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
  
        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    }
  }
  