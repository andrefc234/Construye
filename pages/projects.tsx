import React, { useEffect, useState } from 'react';
import Card from '@/components/Tools/Card'; // Import your Card component
import { Box, CircularProgress, HStack, Center } from '@chakra-ui/react';

// Define types for your data structure
interface ApiResponse {
  data: {
    _id: string;
    obra: string;
    nombreCliente: string;
  }[];
}

function CardList() {
  const [data, setData] = useState<ApiResponse>({ data: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://backendunique.onrender.com/api/v1/obra')
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        setData(data); // Set the data in state
        setIsLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading state to false in case of an error
      });
  }, []);

  if (isLoading) {
    // Display a loading indicator while fetching data
    return (
      <Center>
        <Box textAlign="center" p={4}>
          <CircularProgress isIndeterminate color="teal.500" />
        </Box>
      </Center>
    );
  }

  return (
    <Center>
      <HStack spacing={6} flexWrap="wrap">
        {data.data.map((item) => (
          <Box key={item._id} mb={4}>
            {/* Render the Card component for each item */}
            <Card obra={item.obra} cliente={item.nombreCliente} imageSrc={'/obraimg.jpg'} idobra={item._id} />
          </Box>
        ))}
      </HStack>
    </Center>
  );
}

export default CardList;
