import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Checkbox,
    Stack,
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  const FacturaModal = ({ isOpen, onClose,materialConcepto,materialCantidad,materialPartida,idobra,idrequisicion,nombreObra }) => {
    const [formData, setFormData] = useState({
      fecha: "",
      factura: "",
      importe: "",
      provedor: "",
      banco: "",
      Clabe: "",
      nombreDeposito: "",
      pagado: false,
      idObra:idobra,
      idrequsicion:idrequisicion,
      nombreObra:nombreObra
    });
  
    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    };
    const handleSubmit = () => {
      // Create an object with the form data to send in the POST request
      const requestData = {
        fecha: formData.fecha,
        factura: formData.factura,
        importe: formData.importe,
        provedor: formData.provedor,
        material: [
          {
            Concepto: materialConcepto,
            Cantidad: materialCantidad,
            Partida: materialPartida,
          },
        ],
        banco: formData.banco,
        Clabe: formData.Clabe,
        nombreDeposito: formData.nombreDeposito,
        pagado: formData.pagado,
      };
    
      // Send a POST request to the specified endpoint
      fetch('https://backendunique.onrender.com/api/v1/factura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(requestData), // Convert the data to JSON format
      })
        .then((response) => {
          if (response.status === 201) {
          alert('forma de pago hecha')
            console.log('Factura created successfully');
            // Close the modal
            onClose();
          } else {
            // Handle error response
            console.error('Error creating factura');
          }
        })
        .catch((error) => {
          console.error('Error creating factura:', error);
        });
    };
    
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Ficha Pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Importe</FormLabel>
                <Input
                  type="number"
                  name="importe"
                  value={formData.importe}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Proveedor</FormLabel>
                <Input
                  type="text"
                  name="provedor"
                  value={formData.provedor}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Material Concepto</FormLabel>
                <Input
                  type="text"
                  name="materialConcepto"
                  value={materialConcepto}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Material Cantidad</FormLabel>
                <Input
                  type="text"
                  name="materialCantidad"
                  value={materialCantidad}
                  onChange={handleChange}
                />
              </FormControl>
           
              <FormControl>
                <FormLabel>Banco</FormLabel>
                <Input
                  type="text"
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Clabe</FormLabel>
                <Input
                  type="text"
                  name="Clabe"
                  value={formData.Clabe}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre de Depósito</FormLabel>
                <Input
                  type="text"
                  name="nombreDeposito"
                  value={formData.nombreDeposito}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Pagado</FormLabel>
                <Checkbox
                  name="pagado"
                  isChecked={formData.pagado}
                  onChange={handleChange}
                >
                  Pagado
                </Checkbox>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default FacturaModal;
  