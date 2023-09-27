import { useState ,useEffect} from 'react';
import axios from 'axios'
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

import AddMaterialForm from '@/components/MaterialesPageTools/AddMaterialForm'; // Assuming this is the correct path to your form component

const ButtonModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Button onClick={handleOpenModal}>Add Material</Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddMaterialForm />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  
} from '@chakra-ui/react';


const PartidaOptions = [
  'Preeliminares',
  'Cimentación',
  'Estructura',
  'Albañilería',
  'Tablaroca',
  'Acabados',
  'Pisos y Azulejos',
  'Herrería',
  'Electricidad',
];

const index = () => {
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch materials from the API
    axios
      .get('https://backendunique.onrender.com/api/v1/material/get')
      .then((response) => {
        const data = response.data;

        // Organize materials by partida
        const materialsByPartida = {};
        PartidaOptions.forEach((partida) => {
          materialsByPartida[partida] = data.filter(
            (material) => material.Partida === partida
          );
        });

        setMaterials(materialsByPartida);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching materials:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
   <>
   <ButtonModal/>
    <Tabs>
      <TabList>
        {PartidaOptions.map((partida) => (
          <Tab key={partida}>{partida}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {PartidaOptions.map((partida) => (
          <TabPanel key={partida}>
            <Box p={4}>
            <Table variant="simple" >
                <Thead>
                  <Tr>
                    <Th>Concepto</Th>
                    <Th>Unidad</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {materials[partida].map((material) => (
                    <Tr key={material._id}>
                      <Td>{material.Concepto}</Td>
                      <Td>{material.Unidad}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
    </>
  );
};

export default index;


