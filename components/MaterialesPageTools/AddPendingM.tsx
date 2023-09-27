import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react';

interface Material {
  label: any;
  _id: string;
  Concepto: string;
  Partida: string;
}

interface FormData {
  Concepto: string;
  Cantidad: string;
  Fecha: string;
  Partida: string;
}

interface AddPendingMProps {
  obraId: string;
}

const AddPendingM: React.FC<AddPendingMProps> = ({ obraId }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<FormData>({
    Concepto: '',
    Cantidad: '',
    Fecha: '',
    Partida: '',
  });
  const [partidas, setPartidas] = useState<string[]>([]);
  const [selectedPartida, setSelectedPartida] = useState<string | null>(null);

  // Fetch materials and Partidas from the API when the component mounts
  useEffect(() => {
    axios
      .get<Material[]>('https://backendunique.onrender.com/api/v1/material/get')
      .then((response: { data: Material[] }) => {
        setMaterials(response.data);
        // Extract unique Partidas from materials
        const uniquePartidas = Array.from(new Set(response.data.map((material) => material.Partida)));
        setPartidas(uniquePartidas);
      })
      .catch((error: any) => {
        console.error('Error fetching materials:', error);
      });
  }, []);
  // Filter materials based on selected Partida
  const filteredMaterials = materials.filter((material) =>
    selectedPartida ? material.Partida === selectedPartida : true
  );
  const handleMaterialChange = (selectedOption: Material | null) => {
    setSelectedMaterial(selectedOption);
  };
  const handlePartidaChange = (selectedOption: { value: string; label: string }) => {
    setSelectedPartida(selectedOption.value);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleMaterialSubmit = async () => {
    if (selectedMaterial && selectedPartida) {
      try {
        // Prepare the data to send to the API
        const materialData = {
          ...formData,
          id: selectedMaterial._id, // Material ID
          Partida: selectedPartida,
          Concepto:selectedMaterial.label
           // Include selected Partida
        };
 
        // Create an array with the material data to send
        const materialesPendientesData = [materialData];

        // Send selected material with additional fields to the API endpoint for adding to obra's materialesPendientes
        const response = await axios.post(
          `https://backendunique.onrender.com/api/v1/obra/materialesPendientes/${obraId}`,
          { materialesPendientes: materialesPendientesData }
        );
  
        if (response.status === 200) {
        alert('Agregado')
          // Clear form fields and selected material
          setFormData({
            Concepto: '',
            Cantidad: '',
            Fecha: '',
            Partida: '',
          });
          setSelectedMaterial(null);
        }
      } catch (error) {
        console.error('Error adding material to obra:', error);
      }
    }
  };
  

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="lg" mb={4}>
     Agregar Material a la Obra
      </Heading>
      <FormLabel htmlFor="Partida">Partida</FormLabel>
      <Select
        value={selectedPartida ? { value: selectedPartida, label: selectedPartida } : null}
        onChange={(selectedOption: { value: string; label: string }) =>
          handlePartidaChange(selectedOption)
        }
        options={partidas.map((partida) => ({
          value: partida,
          label: partida,
        }))}
        placeholder="Select Partida"
      />
      <FormLabel htmlFor="Concepto">Concepto</FormLabel>
      <Select
        value={selectedMaterial}
        onChange={(selectedOption: any) =>
          handleMaterialChange(selectedOption as any)
        }
        options={filteredMaterials.map((material) => ({
          value: material._id,
          label: material.Concepto,
        }))}
        placeholder="Select Material"
      />
      <FormControl mb={4}>
        <FormLabel htmlFor="Cantidad">Cantidad</FormLabel>
        <Input
          type="text"
          id="Cantidad"
          name="Cantidad"
          value={formData.Cantidad}
          onChange={handleInputChange}
          placeholder="Cantidad"
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="Fecha">Fecha</FormLabel>
        <Input
          type="date"
          id="Fecha"
          name="Fecha"
          value={formData.Fecha}
          onChange={handleInputChange}
          placeholder="Fecha"
        />
      </FormControl>
      
      <Button colorScheme="teal" onClick={handleMaterialSubmit}>
        Add Material
      </Button>
    </Box>
  );
};

export default AddPendingM;
