import { Box, Stack, Center } from "@chakra-ui/react";
import FacturaTable from "@/components/FacturaTable";
import { useEffect, useState } from "react";

interface Factura {
  _id: string;
  fecha: Date;
  factura: string;
  importe: number;
  provedor: string;
  material: {
    Concepto: string;
    Cantidad: string;
  }[];
  banco: string;
  Clabe: string;
  nombreDeposito: string;
  pagado: boolean;
}

const Facturas = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturasPagado, setFacturasPagado] = useState<Factura[]>([]);
  const [facturasNoPagado, setFacturasNoPagado] = useState<Factura[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://backendunique.onrender.com/api/v1/factura"
      );

      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Filter data based on the "pagado" field
      const pagadoFacturas = data.data.filter((factura: Factura) => factura.pagado);
      const noPagadoFacturas = data.data.filter((factura: Factura) => !factura.pagado);

      setFacturas(data.data);
      setFacturasPagado(pagadoFacturas);
      setFacturasNoPagado(noPagadoFacturas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteFactura = async (id: string) => {
    try {
      const response = await fetch(
        `https://backendunique.onrender.com/api/v1/factura/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFacturas((prevFacturas) => prevFacturas.filter((f) => f._id !== id));
      } else {
        console.error("Error deleting factura");
      }
    } catch (error) {
      console.error("Error deleting factura:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Box mt={5} mb={5}>
          <Center>
            <h1> Pagos Efectuados</h1>
          </Center>
          <FacturaTable data={facturasPagado} onDelete={handleDeleteFactura} />
        </Box>
        <Box mt={2}>
          <Center mt={3}>
            <h1> Pagos no Efectuados</h1>
          </Center>
          <FacturaTable data={facturasNoPagado} onDelete={handleDeleteFactura} />
        </Box>
      </Stack>
    </Box>
  );
};

export default Facturas;
