import React, { useState, useEffect } from 'react';
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';

export default function CrearUsuarioAd() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      alert('Form submitted!');
      setSubmitted(false);
    }
  }, [submitted]);

  const handleSubmit = async (e) => {
    // Prevent the form from submitting and refreshing the page.
    e.preventDefault();

    // Get data from the form.
    const data = {
      nombre: e.target.nombre.value,
      clave: e.target.clave.value,
      telefono: e.target.telefono.value,
      numLicencia: e.target.numLicencia.value,
      role: e.target.role.value,
      password: e.target.password.value,
    };

    console.log(data);

    try {
      const resp = await axios.post(`https://backendunique.onrender.com/api/v1/auth/register`, data);
      console.log(resp);
      setSubmitted(true);
      alert('Agregado');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Stack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel className="text-dark">Nombre</FormLabel>
          <Input type="text" placeholder="Nombre" name="nombre" />
        </FormControl>
        <FormControl>
          <FormLabel className="text-dark">Clave</FormLabel>
          <Input type="text" placeholder="Clave" name="clave" />
        </FormControl>
        <FormControl>
          <FormLabel className="text-dark">Telefono</FormLabel>
          <Input type="text" placeholder="Telefono" name="telefono" />
        </FormControl>
        <FormControl>
          <FormLabel className="text-dark">Numero de licencia</FormLabel>
          <Input type="text" placeholder="Licencia" name="numLicencia" />
        </FormControl>
        <FormControl>
          <FormLabel className="text-dark">Rol</FormLabel>
          <Select name="role">
            <option value="vendedor">Vendedor</option>
            <option value="distribuidor">Distribuidor</option>
            <option value="almacen">Almacen</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel className="text-dark">Password</FormLabel>
          <Input type="password" placeholder="Password" name="password" />
        </FormControl>
        <Button colorScheme="blue" type="submit">
          Submit
        </Button>
      </Stack>
    </Container>
  );
}
