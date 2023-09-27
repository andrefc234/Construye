// pages/[id].js
import { useRouter } from 'next/router';
import AddPendingM from '@/components/MaterialesPageTools/AddPendingM';

import { useState, useEffect, SetStateAction, Key } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack
} from '@chakra-ui/react';
import axios,{ AxiosError } from 'axios';
import useSWR from 'swr';

// Define a fetcher function to fetch data using SWR
const fetcher = async (url: RequestInfo | URL) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
interface Obra {
 data:{
  _id: string;
  obra:string;
  materialesEntregados: [{ id: string }];
  materialesAprobados: [{ id: string }];
  materialesPendientes: [{id:string,Concepto:string,Cantidad:string,Fecha:string,Partida:string}];
  // Add more properties as needed
 }
}

const materiales: React.FC = () => {


  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { id } = router.query; // State for modal
  const { data: obraData, error: obraError } = useSWR(
    id ? `https://backendunique.onrender.com/api/v1/obra/${id}` : null,
    fetcher
  );
console.log(obraData)
// Add router.query.id as a dependency
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  
  const updateMaterialesEntregados = async (
    
    materialesEntregados:  any
  ): Promise<void> => {
    try {
      if ( !materialesEntregados) {
        // Handle missing data or show an error message.
        return;
      }
  
      // Make a PUT request to your backend API to update the materialesEntregados
      const response = await axios.put(
        `https://backendunique.onrender.com/api/v1/obra/${id}/materialesEntregados`,
        { materialesEntregados },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert('Materiales Entregados Actualizados');
        // Optionally, you can perform additional actions after successful update.
      }
    } catch (error) {
      console.error('Error updating materiales entregados:', error);
      // Handle the error or display an error message as needed.
    }

    axios.delete(
      `https://backendunique.onrender.com/api/v1/obra/obra/${id}/materialesAprobados/${materialesEntregados._id}`
    );
  };
  interface Material {
    _id: string;
    Concepto: string;
    Cantidad: string;
    Fecha: string;
    Partida: string;
  }
  
  const handleApproveMaterial = (material: any) => {
    const obraId = material._id;
  console.log(material)
    // Create a new material object with the required properties
    const newMaterial = {
      id: material._id,
      Concepto: material.Concepto,
     // Provide the unit information as needed
      Cantidad: material.Cantidad,
      Fecha:material.Fecha,
      Partida:material.Partida,

    };
  
    // Make a POST request using Axios to update the materialesAprobados
    axios.put(`https://backendunique.onrender.com/api/v1/obra/ob/Aprobados/${id}`, {
      materialesAprobados: [newMaterial],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response: any) => {
        // Handle the successful response here
        alert('Material Aprobado');
        axios.delete(
          `https://backendunique.onrender.com/api/v1/obra/obra/${id}/materialesPendientes/${obraId}`
        );
        // If the approval is successful, send a requisition
        const requisitionData = {
          obraId: id,
          material: [newMaterial],
          aceptado: false, // Assuming the material is approved
          fecha: new Date().toISOString(),
          nombreObra:obraData?.data?.obra,
           // Include the date as needed
        };
  
        axios.post('https://backendunique.onrender.com/api/v1/requisicion', requisitionData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((requisitionResponse: any) => {
            // Handle the successful requisition response here
            alert('Requisition sent');
          })
          .catch((requisitionError: AxiosError) => {
            // Handle errors here if sending the requisition fails
            console.error('Error sending requisition:', requisitionError.response?.data);
          });
      })
      .catch((error: AxiosError) => {
        // Handle errors here if updating the material fails
        console.error('Error updating material:', error.response?.data);
      });
  };
  
 useEffect(() => {
    if (obraData || obraError) {
      setLoading(false);
    }
  }, [obraData, obraError]);

  const [loading, setLoading] = useState<boolean>(true);
  const handleDeleteMaterialPendiente = async (materialId: any) => {
    try {
      // Make a DELETE request to your backend API to delete the material
      const response = await axios.delete(
        `https://backendunique.onrender.com/api/v1/obra/obra/${id}/materialesPendientes/${materialId}`
      );

      if (response.status === 200) {
       alert('Material Eliminado')
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };


const handleDeleteMaterialAprobado = async (

  materialAprobadoId: string | undefined
): Promise<void> => {
  try {
    

    // Make a DELETE request to your backend API to delete the material aprobado
    const response = await axios.delete(
      `https://backendunique.onrender.com/api/v1/obra/obra/${id}/materialesAprobados/${materialAprobadoId}`
    );

    if (response.status === 200) {
      alert('Material Aprobado Eliminado');
      // Optionally, you can perform additional actions after successful deletion.
    }
  } catch (error) {
    console.error('Error deleting material aprobado:', error);
    // Handle the error or display an error message as needed.
  }
};
  if (loading && !obraData && !obraError) {
    // While data is loading
    return <Spinner size="xl" />;
  }

  if (obraError) {
    // Handle the error
    console.error('Error fetching obra data:', obraError);
    return <div>Error loading obra data</div>;
  }
  return (
 <>
 {obraData ?  <>
 <HStack>
  <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>{obraData?.data?.obra}</h1>
<Button colorScheme="teal" onClick={openModal} style={{  marginLeft: '15px' ,marginBottom:'5px'}}>
 Agregar Material
</Button>
</HStack>
    <Tabs>
      <TabList>
        <Tab>Materiales Entregados</Tab>
        <Tab>Materiales Aprobados</Tab>
        <Tab>Materiales Pendientes</Tab>
          
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box p={4}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                    <Th>Concepto</Th>
                    <Th>Cantidad</Th>
                    <Th>Fecha</Th>
                    <Th>Partida</Th>
                </Tr>
              </Thead>
              <Tbody>
                {obraData?.data?.materialesEntregados?.map((material: { _id: Key | null | undefined; Concepto: any; Cantidad: any; Fecha: any; Partida: any; }) => (
                  <Tr key={material._id}>
                    <Td>{material._id}</Td>
                    <Td>{material.Concepto}</Td>
                    <Td>{material.Cantidad}</Td>
                    <Td>{material.Fecha}</Td>
                    <Td>{material.Partida}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box p={4}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                <Th>ID</Th>
                    <Th>Concepto</Th>
                    <Th>Cantidad</Th>
                    <Th>Fecha</Th>
                    <Th>Partida</Th>
                    <Th>Entregar</Th>
                    <Th>Eliminar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {obraData?.data?.materialesAprobados?.map((material: { id: Key | null | undefined; _id: any; Concepto: any; Cantidad: any; Fecha: any; Partida: any; }) => (
                  <Tr key={material.id}>
                  <Td>{material._id}</Td>
                    <Td>{material.Concepto}</Td>
                    <Td>{material.Cantidad}</Td>
                    <Td>{material.Fecha}</Td>
                    <Td>{material.Partida}</Td>
                    <Td>
            <Button
              colorScheme="green"
              size="sm"
              onClick={() => updateMaterialesEntregados(material)} // Call the delete function with the material ID
            >
             Entregar
            </Button>
          </Td>
                      <Td>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDeleteMaterialAprobado(material._id)} // Call the delete function with the material ID
            >
              Eliminar
            </Button>
          </Td>
          
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TabPanel>
        <TabPanel>
          <Box p={4}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                <Th>ID</Th>
                    <Th>Concepto</Th>
                    <Th>Cantidad</Th>
                    <Th>Fecha</Th>
                    <Th>Partida</Th>
                    <Th>Aprobar</Th>
                    <Th>Eliminar</Th>

                </Tr>
              </Thead>
              <Tbody>
                {obraData?.data?.materialesPendientes?.map((material: { id: Key | null | undefined; _id: any; Concepto: any; Cantidad: any; Fecha: any; Partida: any; }) => (
                  <Tr key={material.id}>
                    <Td>{material._id}</Td>
                    <Td>{material.Concepto}</Td>
                    <Td>{material.Cantidad}</Td>
                    <Td>{material.Fecha}</Td>
                    <Td>{material.Partida}</Td>
                    <Td>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => handleApproveMaterial(material)} // Call the delete function with the material ID
            >
             Aprobar
            </Button>
          </Td>
                    <Td>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDeleteMaterialPendiente(material._id)} // Call the delete function with the material ID
            >
              Eliminar
            </Button>
          </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
        
          <ModalCloseButton />
          <ModalBody>
            {/* Include MaterialForm component */}
            <AddPendingM obraId={obraData?.data?._id} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   </> : <Spinner size="xl" />}
 </>
  );
};

export default materiales;

