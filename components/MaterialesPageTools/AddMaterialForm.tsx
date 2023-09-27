import { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import axios from 'axios';

interface FormData {
  Partida: string;
  Concepto: string;
  Unidad: string;
}

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

const AddMaterialForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    Partida: '',
    Concepto: '',
    Unidad: '',
  });

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const handlePartidaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Show additional fields when a Partida is selected
    setShowAdditionalFields(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Send formData to the API
      const response = await axios.post(
        'https://backendunique.onrender.com/api/v1/material/crear',
        formData
      );

      if (response.status === 201) {
        alert('Agregado')
        // Reset the form fields
        setFormData({
          Partida: '',
          Concepto: '',
          Unidad: '',
        });
        // Hide additional fields
        setShowAdditionalFields(false);
        // Show success alert
        setSuccessAlert(true);
        setErrorAlert(false);

        // Hide success alert after a few seconds
        setTimeout(() => {
          setSuccessAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding material:', error);
      // Show error alert
      setErrorAlert(true);
      setSuccessAlert(false);

      // Hide error alert after a few seconds
      setTimeout(() => {
        setErrorAlert(false);
      }, 3000);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="lg" mb={4}>
        Add Material
      </Heading>
      <form onSubmit={handleSubmit}>
        {/* Success Alert */}
        {successAlert && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            ¡Material Agregado!
          </Alert>
        )}

        {/* Error Alert */}
        {errorAlert && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            Error.  Intentalo Mas Tarde.
          </Alert>
        )}

        <FormControl mb={4}>
          <FormLabel htmlFor="Partida">Partida</FormLabel>
          <Select
            id="Partida"
            name="Partida"
            value={formData.Partida}
            onChange={handlePartidaChange}
            required
          >
            <option value="">Select Partida</option>
            {PartidaOptions.map((partida) => (
              <option key={partida} value={partida}>
                {partida}
              </option>
            ))}
          </Select>
        </FormControl>

        {showAdditionalFields && (
          <>
            <FormControl mb={4}>
              <FormLabel htmlFor="Concepto">Concepto</FormLabel>
              <Input
                type="text"
                id="Concepto"
                name="Concepto"
                value={formData.Concepto}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="Unidad">Unidad</FormLabel>
              <Input
                type="text"
                id="Unidad"
                name="Unidad"
                value={formData.Unidad}
                onChange={handleInputChange}
                required
              />
            </FormControl>
          </>
        )}

        <Button colorScheme="teal" type="submit">
          Agregar Material
        </Button>
      </form>
    </Box>
  );
};

export default AddMaterialForm;
