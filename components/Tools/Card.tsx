import {
    Heading,
    Avatar,
    Box,
    Center,
  
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react';
  import Image from 'next/image'
  import {  Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
  // Define the props type
  interface CardProps {
    obra?: string;
    cliente?: string;
    imageSrc?: string;
    idobra?:string;
 
  }
  
  export default function Card({
    obra,
    cliente,
    imageSrc,
    idobra
 
  }: CardProps) {
    return (
      <Center py={6}>
        <Box
          maxW={'370px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}
        >
          <Image
            height={'50'}
            width={'400'}
            src={imageSrc || ''}
           
          
          />
         
  
          <Box p={7}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {obra}
              </Heading>
              <Text color={'gray.500'}>{cliente}</Text>
            </Stack>
  
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
              <ChakraLink as={Link} href={`/material/${idobra}`} passHref>
  <Button
    w={'full'}
    mt={8}
    bg={useColorModeValue('#151f21', 'gray.900')}
    color={'white'}
    rounded={'md'}
    _hover={{
      transform: 'translateY(-2px)',
      boxShadow: 'lg',
    }}
  >
    Material
  </Button>
</ChakraLink>
              </Stack>
              <Stack spacing={0} align={'center'}>
              <ChakraLink as={Link} href={`/requisitions/${idobra}`} passHref>
  <Button
    w={'full'}
    mt={8}
    bg={useColorModeValue('#151f21', 'gray.900')}
    color={'white'}
    rounded={'md'}
    _hover={{
      transform: 'translateY(-2px)',
      boxShadow: 'lg',
    }}
  >
    Requisiciones
  </Button>
</ChakraLink>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Center>
    );
  }
  