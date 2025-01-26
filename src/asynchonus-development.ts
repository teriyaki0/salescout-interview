type RequestsResult = {
  data: any;
  status: number;
};

async function fetchAll(urls: string[]): Promise<RequestsResult[]> {
  const fetchPromises = urls.map(async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error(`Error fetching URL: ${url}`, error);
      return { data: null, status: 500 };
    }
  });

  return Promise.all(fetchPromises);
}

module.exports = { fetchAll };
