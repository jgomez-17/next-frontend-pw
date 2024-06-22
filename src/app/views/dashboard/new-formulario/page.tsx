'use client'

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button, Form, message } from 'antd';
import { IoChevronBack } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { PlusIcon } from '@/app/components/ui/iconos';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const onSearch = (value: string) => {
    console.log('search:', value);
};

const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

interface Orden {
    id: number;
    fecha_orden: string;
    cliente: {
      nombre: string;
      celular: string;
      correo: string;
    };
    vehiculo: {
      marca: string;
      tipo: string;
      color: string;
      llaves: boolean;
    };
    servicio: {
      nombre_servicios: string;
      costo: number;
    };
}

interface ListaOrdenesProps {
  fetchOrdenesEnEspera: () => void;
}

const NewForm: React.FC<ListaOrdenesProps> = ({ fetchOrdenesEnEspera }) => {

    // Verificar Placa
    const [verifyplaca, setVerifyPlaca] = useState('');
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [error, setError] = useState('');
    // Estado para los datos de la orden
    const [placa, setPlaca] = useState('');
    const [marca, setMarca] = useState('');
    const [tipo, setTipo] = useState('');
    const [color, setColor] = useState('');
    const [llaves, setLlaves] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [nombre, setNombre] = useState('');
    const [celular, setCelular] = useState('');
    const [correoCliente, setCorreoCliente] = useState('');
    const [servicios, setServicios] = useState<{ nombre: string, costo: number}[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
    const [nombresServicios, setNombresServicios] = useState<string>(''); 
    const [descuento, setDescuento] = useState<number>(0); 
    //Estado para las secciones
    const [seccion, setSeccion] = useState<number>(1);

    //Funciones para avanzar y retroceder seccion
    const avanzarSeccion = () => {
        if (seccion === 2 && !tipo) {
        message.warning("Por favor selecciona un tipo de vehículo.");
        return;
        }
        setSeccion(seccion + 1);
    };

    const retrocederSeccion = () => {
        setSeccion(seccion - 1);
    };

    // Función para consultar orden mediante placa
    const consultarOrden = async () => {
      if (!verifyplaca) {
          setError('Por favor, ingresa una placa.');
          message.error('Por favor, ingresa una placa.');
          setOrdenes([]);
          return;
      }

      if (verifyplaca.length !== 7) {
          message.warning('Por favor ingresa una placa válida');
          return;
      }

      try {
          const response = await fetch(`https://express-api-pw.onrender.com/api/vehiculos/placa/${verifyplaca}`);
          const data = await response.json();

          // Ahora solo tienes una orden en lugar de un array de ordenes
          const ordenEncontrada = data.orden;

          if (ordenEncontrada) {
              // Si se encontró una orden, actualiza los estados del formulario con los datos de la orden encontrada
              setPlaca(ordenEncontrada.vehiculo.placa);
              setMarca(ordenEncontrada.vehiculo.marca);
              setTipo(ordenEncontrada.vehiculo.tipo);
              setColor(ordenEncontrada.vehiculo.color);
              setNombre(ordenEncontrada.cliente.nombre);
              setCelular(ordenEncontrada.cliente.celular);
              setCorreoCliente(ordenEncontrada.cliente.correo);
              message.success('Orden encontrada');
          } else {
              message.info('No hay ordenes previas relacionadas a este vehiculo');
              setOrdenes([]);
              setPlaca(verifyplaca);
              setMarca('');
              setTipo('');
              setColor('');
              setNombre('');
              setCelular('');
              setCorreoCliente('');
          }

          avanzarSeccion();
          setError('');
      } catch (error: any) {
          setError(error.message);
          message.warning('No hay ordenes previas relacionadas a este vehiculo');
          setOrdenes([]);
          setPlaca(verifyplaca);
          setMarca('');
          setTipo('');
          setColor('');
          setNombre('');
          setCelular('');
          setCorreoCliente('');
          
          avanzarSeccion();
      }
    };

    
    const handleRefresh = () => {
      setVerifyPlaca('');
      setOrdenes([]);
      setError('');
    };

    // Definir precios de servicios por tipo de vehículo
    const preciosServiciosPorTipo: Record<string, Record<string, number>> = {
        Automovil: {
        "Brillado Manual": 60000,
        "Brillado Rotorbital":80000,
        "Completo Plus": 30000,
        "Ceramico":500000,
        "Descontaminacion conductos de aire":30000,
        "Desmanchado de pintura":160000,
        "Hidratacion de interior":60000,
        "Limpieza cogineria de cuero":90000,
        "Limpieza cogineria de paño":80000,
        "Limpieza de motor":30000,
        "Polichado":140000,
        "Polichado Americano":180000,
        "Plasticina":170000,
        "Porcelanizado":500000,
        "Restauracion de partes negras":60000,
        // Otros servicios para automóviles...
        },
        Camioneta: {
        "Brillado Manual": 70000,
        "Brillado Rotorbital":110000,
        "Completo Plus": 35000,
        "Ceramico":600000,
        "Descontaminacion conductos de aire":30000,
        "Desmanchado de pintura":180000,
        "Hidratacion de interior":70000,
        "Polichado":150000,
        "Polichado Americano":210000,
        "Limpieza cogineria de cuero":110000,
        "Limpieza cogineria de paño":90000,
        "Limpieza de motor":30000,
        "Plasticina":190000,
        "Porcelanizado":600000,
        "Restauracion de partes negras":70000,
        // Otros servicios para camionetas...
        },
    };

    const [preciosServicios, setPreciosServicios] = useState<Record<string, number>>(
        preciosServiciosPorTipo[tipo] || {}
    );

    useEffect(() => {
        setPreciosServicios(preciosServiciosPorTipo[tipo] || {});
    }, [tipo, preciosServiciosPorTipo]);

    // Manejar la adición de un servicio seleccionado de un solo nombre
    const handleAgregarServicio = () => {
        if (servicioSeleccionado) {
        const servicioNombre = servicioSeleccionado.split(' - ')[0]; // Obtener solo el nombre del servicio
        const servicioExistente = servicios.find(servicio => servicio.nombre === servicioNombre);
        if (!servicioExistente) {
            const costo = parseFloat(servicioSeleccionado.split(' - ')[1].replace('$', ''));
            setServicios([...servicios, { nombre: servicioNombre, costo }]);
            setNombresServicios(prev => prev ? prev + ', ' + servicioNombre : servicioNombre); 
            setServicioSeleccionado(''); // Restablecer la selección
        }
        }
    };

    // Maneja la eliminación de un servicio seleccionado para solo nombre
    const handleRemoveServicio = (nombre: string) => {

        const serviciosFiltrados = servicios.filter(servicio => servicio.nombre !== nombre);
        setServicios(serviciosFiltrados);
        // setServicios(servicios.filter(servicio => servicio.nombre !== nombre));
        const nuevosNombres = serviciosFiltrados.map(servicio => servicio.nombre).join(', ');
        setNombresServicios(nuevosNombres);
    };

    // Calcula el costo de servicio y con el descuento
    const costoServicios: number = servicios.reduce((total, servicio) => {
        return total + servicio.costo;
    }, 0);
    
    const costoConDescuento: number = costoServicios - descuento;

    const [isSheetOpen, setIsSheetOpen] = useState(false)
    
    //Envio del formulario al backend
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!placa || !marca || !tipo || !color || !nombre || !celular) {
          message.warning("Por favor completa los campos obligatorios.");
          return;
        }
    
        if (placa.length !== 7) {
          message.warning("Por favor ingresa una placa válida");
          return;
        }
    
        if (servicios.length === 0) {
          message.warning("Por favor selecciona al menos un servicio.");
          return;
        }
    
        if (llaves.length === 0) {
          message.warning("Por favor selecciona si deja llaves o no");
          return;
        }
    
        if (celular.length !== 10) {
          message.warning("Por favor ingresa un número de teléfono válido");
          return;
        }
      
        // Objeto de datos a enviar
        const dataOrdens = {
          placa: placa,
          marca: marca,
          tipo: tipo,
          color: color,
          llaves: llaves,
          observaciones: observaciones,
          nombre: nombre,
          celular: parseInt(celular),
          correo: correoCliente,
          nombre_servicios: nombresServicios,
          servicios: servicios.map(servicio => ({
            nombre_servicio: servicio.nombre,
            costo: servicio.costo
          })),
          costo: costoConDescuento,
        };
        
          try {
             const responseOrdenes = await fetch('https://express-api-pw.onrender.com/api/ordenes', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({ data: dataOrdens })
             });
        
             if (!responseOrdenes.ok) {
               console.error('Error en la petición:', responseOrdenes.statusText);
             }
             
        
            // resetea el formulario si las solicitudes son exitosas
            //  setPlaca('');
            //  setMarca('');
            //  setTipo('');
            //  setColor('');
            //  setLlaves('');
            //  setObservaciones('');
            //  setNombre('');
            //  setCelular('');
            //  setCorreoCliente('');
            //  setServicios([]);
            //  setDescuento(0);
            //  setNombresServicios('');
    
            console.log('orden generada')
            console.log(dataOrdens)
            message.success('Orden generada')
            fetchOrdenesEnEspera();
            setIsSheetOpen(false);
            handleGenerarFactura();            
  
        } catch (error) {
          console.error('Error en la solicitud:', error);
          message.error('Error en la solicitud')
        }
    };

    //Generar factura
    const handleGenerarFactura = () => {
      const doc = new jsPDF();
    
      doc.setFont('times'); // Tipo de letra
      doc.setFontSize(10); // Tamaño de letra
      doc.setTextColor('#333'); // Color de texto
    
      // Obtener la fecha actual
      const fechaActual = new Date();
      const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
    
      // Encabezado
      doc.setFontSize(18);
      doc.text('Factura', 20, 20);
    
      // Encabezado de los datos del cliente
      doc.setFontSize(12);
      doc.text(`Fecha: ${fechaFormateada}`, 150, 22); // Mostrar la fecha

      doc.setFontSize(10);
      doc.text(`Facturar a:`, 20, 40)

      doc.setFontSize(10);
      doc.text(`${nombre}`, 20, 46);
      doc.text(`${celular}`, 20, 52);
    
      // Encabezado de los datos del vehículo
      doc.setFontSize(10);
      doc.text(`Vehículo: `, 150, 40); // Nueva columna
      doc.setFontSize(10);
      doc.text(`${marca} ${color}`, 150, 46)
      doc.text(`Placa: ${placa}`, 150, 52); // Nueva columna
    
      // doc.text(`Llaves: ${llaves}`, 20, 55); // Puedes añadir más datos si es necesario
      doc.text(`Observaciones: ${observaciones}`, 20, 70);
    
      // Detalles de los servicios
      const serviciosData = servicios.map(servicio => [servicio.nombre, formatCurrency(servicio.costo)]);
      
      // Ajustar el ancho de la primera columna de la tabla
      const columnStyles = {
        0: { cellWidth: 100 }, // Ancho deseado para la primera columna
        1: { cellWidth: 70 } // Ancho deseado para la segunda columna
      };
    
      autoTable(doc, {
        head: [['Servicio', 'Costo Unitario']],
        body: serviciosData,
        startY: 80, // Ajustar el startY para dejar espacio entre los datos y la tabla
        margin: { left: 20 }, // Mueve la tabla a la derecha
        columnStyles: columnStyles,
        didDrawPage: (data) => {
          // Totales
          const cursorY = data.cursor?.y ?? 80;
          const totalY = cursorY + 10;
          doc.text(`Subtotal: ${formatCurrency(costoServicios)}`, 20, totalY);
          doc.text(`Descuento: ${formatCurrency(descuento)}`, 20, totalY + 5);
          doc.text(`Total: ${formatCurrency(costoConDescuento)}`, 20, totalY + 10);
        }
      });
    
      doc.save(`Factura_${placa}.pdf`);
    };

    function formatCurrency(number: number) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, }).format(number);
    }


  return (
    <>
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger
        style={{fontFamily: 'Roboto'}} 
        className='flex gap-1 ml-auto items-center bg-black text-white font-medium border border-gray-700 hover:bg-transparent hover:text-blue-900 hover:font-medium hover:border-blue-900 py-1 text-sm px-5 rounded-md' >
        Nueva orden
        <PlusIcon />
    </SheetTrigger>
    <SheetContent
      style={{  maxWidth: '100vw'}} 
      className='max-md:w-svw overflow-y-auto' >
        <SheetHeader>
        <SheetTitle>Crear nueva orden</SheetTitle>
        <SheetDescription className='m-auto'>
          <p className=' text-transparent'>Hola</p>
        </SheetDescription>
        </SheetHeader>
            <Form 
              id='orden' 
              onSubmitCapture={handleSubmit} 
              className='flex flex-col gap-10' 
              style={{fontFamily: 'Overpass Variable'}} 
            >
                
                {seccion === 1 && (
                    <>
                    <section className='bg-slate-400/5 max-md:w-full w-1/2 m-auto p-6 rounded-md'>
                        <span className='ml-1 text-zinc-500 font-medium'> Ingresar placa </span>
                        <article className='flex items-center'>
                        <Input 
                            className='uppercase w-36 h-8' 
                            type="text" 
                            value={verifyplaca} 
                            onChange={(e) => {
                            let inputValue = e.target.value.toUpperCase();
                            inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

                            if (inputValue.length > 3) {
                                inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
                            }

                            inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

                            if (inputValue.includes('-')) {
                                const parts = inputValue.split('-');
                                parts[1] = parts[1].replace(/[^0-9]/g, '');
                                inputValue = parts.join('-');
                            }

                            inputValue = inputValue.slice(0, 7);
                            setVerifyPlaca(inputValue);
                            }} 
                            maxLength={7} // Permitir 3 letras, 1 guión y 3 números
                            required 
                        />
                        <Button 
                            className='mx-4 my-2 bg-black text-white' 
                            onClick={consultarOrden} >
                            Verificar
                        </Button>
                        <Button onClick={handleRefresh}>
                            Limpiar
                        </Button>
                        </article>
                    </section>
                    </>
                )}

                {seccion === 2 && (
                <>
                  <fieldset className='flex flex-wrap gap-x-5 gap-y-3 max-md:w-full'>
                      <legend className=' font-medium'> Datos del vehiculo</legend>

                      <label>
                        <span className='ml-1 text-zinc-500'>Placa
                        {/* <span className='text-red-500'>*</span> */}
                        </span>
                        
                        <Input 
                          className='input uppercase w-[150px]' 
                          type="text" 
                          value={placa} 
                          onChange={(e) => {

                          let inputValue = e.target.value.toUpperCase();
              
                            inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

                            if (inputValue.length > 3) {
                            inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
                            }

                            inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

                            if (inputValue.includes('-')) {
                              const parts = inputValue.split('-');
                              parts[1] = parts[1].replace(/[^0-9]/g, '');
                              inputValue = parts.join('-');
                            }

                            inputValue = inputValue.slice(0, 7);

                            setPlaca(inputValue);
                          }} 
                          maxLength={7}
                          required 
                        />

                      </label>

                      <label>
                        <span className='ml-1 text-zinc-500'> Marca </span>
                        <Select
                            value={marca}
                            onValueChange={(value) => setMarca(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Audi">Audi</SelectItem>
                                <SelectItem value="BMW">BMW</SelectItem>
                                <SelectItem value="Cadillac">Cadillac</SelectItem>
                                <SelectItem value="Citroen">Citroen</SelectItem>
                                <SelectItem value="Chery">Chery</SelectItem>
                                <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                                <SelectItem value="Dodge">Dodge</SelectItem>
                                <SelectItem value="Fiat">Fiat</SelectItem>
                                <SelectItem value="Ford">Ford</SelectItem>
                                <SelectItem value="Honda">Honda</SelectItem>
                                <SelectItem value="Hyundai">Hyundai</SelectItem>
                                <SelectItem value="Jeep">Jeep</SelectItem>
                                <SelectItem value="Jaguar">Jaguar</SelectItem>
                                <SelectItem value="Kia">Kia</SelectItem>
                                <SelectItem value="Land Rover">Land Rover</SelectItem>
                                <SelectItem value="Lexus">Lexus</SelectItem>
                                <SelectItem value="Mazda">Mazda</SelectItem>
                                <SelectItem value="Mercedes">Mercedes</SelectItem>
                                <SelectItem value="Mitsubishi">Mitsubishi</SelectItem>
                                <SelectItem value="Mini Cooper">Mini Cooper</SelectItem>
                                <SelectItem value="Nissan">Nissan</SelectItem>
                                <SelectItem value="Toyota">Toyota</SelectItem>
                                <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                                <SelectItem value="Peugeot">Peugeot</SelectItem>
                                <SelectItem value="Porsche">Porsche</SelectItem>
                                <SelectItem value="Renault">Renault</SelectItem>
                                <SelectItem value="Rolls Royce">Rolls Royce</SelectItem>
                                <SelectItem value="Subaru">Subaru</SelectItem>
                                <SelectItem value="Suzuki">Suzuki</SelectItem>
                                <SelectItem value="Volvo">Volvo</SelectItem>
                                <SelectItem value='Otro' >Otro</SelectItem>
                            </SelectContent>
                        </Select>
                      </label>

                      <label>
                        <span className='ml-1 text-zinc-500'> Tipo </span>
                        <Select
                            value={tipo}
                            onValueChange={(value) => setTipo(value)}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Automovil">Automovil</SelectItem>
                                <SelectItem value="Camioneta">Camioneta</SelectItem>
                            </SelectContent>
                        </Select>
                      </label>

                      <label>
                        <span className='ml-1 text-zinc-500'> Color </span>
                        <Select
                            value={color}
                            onValueChange={(value) => setColor(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Negro">Negro</SelectItem>
                                <SelectItem value="Blanco">Blanco</SelectItem>
                                <SelectItem value="Azul">Azul</SelectItem>
                                <SelectItem value="Amarillo">Amarillo</SelectItem>
                                <SelectItem value="Beige">Beige</SelectItem>
                                <SelectItem value="Gris">Gris</SelectItem>
                                <SelectItem value="Morado">Morado</SelectItem>
                                <SelectItem value="Plateado">Plateado</SelectItem>
                                <SelectItem value="Rojo">Rojo</SelectItem>
                                <SelectItem value="Vinotinto">Vinotinto</SelectItem>
                                <SelectItem value="Verde">Verde</SelectItem>
                            </SelectContent>
                        </Select>
                      </label>

                      <label>
                        <span className='ml-1 text-zinc-500'> Deja llaves? </span>
                        <Select
                            value={llaves}
                            onValueChange={(value) => setLlaves(value)}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Si">Si</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                      </label>

                      <label>
                        <span className='ml-1 text-zinc-500'>Observaciones</span>
                        <Textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)}/>
                      </label>
                  </fieldset>

                  <fieldset className='flex flex-wrap gap-x-5 gap-y-3 max-md:w-full'>
                    <legend>Datos del cliente</legend>
                    <label>
                      <span className='ml-1 text-zinc-500'>Nombre</span>
                      <Input className='input capitalize max-md:w-40 ' 
                        type="text" value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required
                      />
                    </label>
                    <label>
                      <span className='ml-1 text-zinc-500'>Celular</span>
                      <Input 
                        className='input max-md:w-40'
                        type="text" 
                        value={celular} 
                        onChange={(e) => {
                          const formattedValue = e.target.value.replace(/\D/g, '');
                          const trimmedValue = formattedValue.slice(0, 10);
                          setCelular(trimmedValue);
                        }} 
                        maxLength={10}             />
                    </label>
                    {/* <label>
                      <span className='ml-1 text-zinc-500'>Celular</span>
                      <Input 
                        className='input max-md:w-40'
                        type="text" 
                        value={celular} 
                        onChange={(e) => {
                          const formattedValue = e.target.value.replace(/\D/g, '');
                          const trimmedValue = formattedValue.slice(0, 10);
                          setCelular(trimmedValue);
                        }} 
                        maxLength={10}             />
                    </label> */}
                    <label>
                        <span className='ml-1 text-zinc-500'>Correo</span>
                        <Input 
                          className='input'
                          type="email" 
                          value={correoCliente} 
                          onChange={(e) => setCorreoCliente(e.target.value)} 
                        />
                    </label>
                  </fieldset>

                  <section className='flex max-w-min m-auto gap-3'>
                    <Button 
                      className='bg-black p-4 flex items-center gap-2 text-white hover:bg-zinc-800'
                      onClick={retrocederSeccion}
                      >
                      <IoChevronBack />
                      Volver
                    </Button>
                    <Button
                      className='flex p-4 items-center font-medium' 
                      onClick={avanzarSeccion}>
                      Siguiente
                      <GrFormNext className=' text-lg' />
                    </Button>
                  </section>
                </>
                )}

                {seccion === 3 &&(
                <>
                  <fieldset className='flex max-md:flex-col gap-2'>
                    <legend>Datos del Servicio</legend>
                      <section className='w-max gap-7 mt-0 rounded-md flex flex-col'>
                      <label>
                        <span> Servicios </span>
                        <div className='flex items-center gap-4'>
                        <Select
                            value={servicioSeleccionado}
                            onValueChange={(value) => setServicioSeleccionado(value)}
                        >
                            <SelectTrigger className="w-[350px] max-md:w-[280px]">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(preciosServicios).map(([nombreServicio, costo]) => (
                                    <SelectItem key={nombreServicio} value={`${nombreServicio} - $${costo}`}>
                                    {nombreServicio} - ${costo.toLocaleString('es-CO')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                              className=' bg-white border-slate-200 rounded-lg h-10 border' 
                              type="text" 
                              title='Agregar'
                              onClick={handleAgregarServicio}
                            >
                              <FaPlus />
                        </Button>
                        </div>
                      </label>

                      <label>
                          <span>
                            Aplicar descuento
                          </span>
                          <Input 
                            className='w-36'
                            placeholder='$'
                            type="number" 
                            value={descuento || ''} 
                            onChange={(e) => setDescuento(parseFloat(e.target.value))} 
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                setDescuento(0);
                              }
                          }}
                          />
                      </label>

                      <label>
                          <Input 
                            className='nombre_servicios hidden' 
                            type="text" 
                            name='nombre_servicios' 
                            value={nombresServicios} 
                            readOnly 
                          />
                      </label>
                    </section>
                
                    <section className="md:bg-slate-50/50 m-auto items-start flex flex-col w-2/5 max-md:w-full rounded p-2">
                      <span className='font-semibold my-3'>
                        Detalles de la orden
                      </span>
                          {servicios.map(servicio => (
                              <article 
                                title='seleccione para eliminar servicio' 
                                key={servicio.nombre} 
                                className="servicio py-1 transition cursor-pointer hover:text-red-500 text-gray-600" 
                                onClick={() => handleRemoveServicio(servicio.nombre)}>
                                {servicio.nombre}
                              </article>
                            ))}

                        <label className='ml-0 mt-5'>
                          <span className=''>
                            Subtotal
                          </span>
                          <Input 
                              className='costo-servicios bg-transparent' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoServicios.toLocaleString('es-CO')}`} 
                              readOnly 
                          />
                        </label>

                        <label className='ml-0'>
                          <span>
                            Total
                          </span>
                          <Input 
                              className='costo-con-descuentos bg-transparent' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoConDescuento.toLocaleString('es-CO')}`} 
                              readOnly 
                            />
                        </label>
                    </section>
                  </fieldset>
                  <section className='flex max-w-min m-auto gap-3'>
                      <Button 
                        className='flex p-4 gap-2 items-center hover:bg-zinc-800'
                        onClick={retrocederSeccion}
                        >
                        <IoChevronBack />
                        Volver
                      </Button>
                        <Button
                            onClick={handleSubmit} 
                            className='flex p-4 bg-black text-white w-32 items-center justify-center' 
                            >
                            Generar orden
                        </Button>
                  </section>
                </>
                )}

            </Form>
    </SheetContent>
    </Sheet>
    </>
  )
}

export default NewForm