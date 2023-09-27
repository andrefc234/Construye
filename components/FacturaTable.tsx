import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const FacturaTable = ({ data, onDelete }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Fecha</Th>
         
          <Th>Importe</Th>
          <Th>Proveedor</Th>
          <Th>Material</Th>
          <Th>Banco</Th>
          <Th>Clabe</Th>
          <Th>Nombre de Depósito</Th>
          <Th>Pagado</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((factura) => (
          <Tr key={factura._id}>
            <Td>{factura.fecha}</Td>
           
            <Td>{factura.importe}</Td>
            <Td>{factura.provedor}</Td>
            <Td>
              {factura.material.map((material, index) => (
                <div key={index}>
                  <p>Concepto: {material.Concepto}</p>
                  <p>Cantidad: {material.Cantidad}</p>
                </div>
              ))}
            </Td>
            <Td>{factura.banco}</Td>
            <Td>{factura.Clabe}</Td>
            <Td>{factura.nombreDeposito}</Td>
            <Td>{factura.pagado ? "Pagado" : "No Pagado"}</Td>
            <Td>
              <IconButton
                aria-label="Delete factura"
                icon={<DeleteIcon />}
                colorScheme="red"
                size="sm"
                onClick={() => onDelete(factura._id)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default FacturaTable;
