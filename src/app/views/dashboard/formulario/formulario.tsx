'use client'

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Form, message } from 'antd';
import { Button } from '@/components/ui/button';
import { IoChevronBack } from "react-icons/io5";
import { GrFormNext } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { PlusIcon, Spin } from '@/app/components/ui/iconos';
import { OrdenData, generarFacturaPDF } from './generarFactura';
import ServiciosSelect from './serviciosSelect';

interface Orden {
    id: number;
    fecha_orden: string;
    cliente: {
      nombre: string;
      celular: string;
      correo: string;
    };
    vehiculo: {
      placa: string;
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

    const [verifyplaca, setVerifyPlaca] = useState('');
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [error, setError] = useState('');
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
    const [seccion, setSeccion] = useState<number>(1);
    const [loading, setLoading] = useState(false);


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
      setLoading(true);

      if (!verifyplaca) {
          setError('Por favor, ingresa una placa.');
          message.error('Por favor, ingresa una placa.');
          setOrdenes([]);
          return;
      }

      if (verifyplaca.length !== 7) {
          message.warning('Por favor ingresa una placa válida');
          setLoading(false);
          return;
      }

      try {
          const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/vehiculos/placa/${verifyplaca}`
          const response = await fetch(apiUrl);
          const data = await response.json();

          const ordenEncontrada = data.orden;

          if (ordenEncontrada) {
              setPlaca(ordenEncontrada.vehiculo.placa);
              setMarca(ordenEncontrada.vehiculo.marca);
              setTipo(ordenEncontrada.vehiculo.tipo);
              setColor(ordenEncontrada.vehiculo.color);
              setNombre(ordenEncontrada.cliente.nombre);
              setCelular(ordenEncontrada.cliente.celular);
              setCorreoCliente(ordenEncontrada.cliente.correo);
              message.success('Orden encontrada');
              setLoading(false);
          } else {
              setLoading(false);
              message.info('No hay ordenes previas relacionadas a este vehiculo');
              setLoading(false);
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
          setLoading(false);
      }
    };

    const handleRefresh = () => {
      setVerifyPlaca('');
      setOrdenes([]);
      setError('');
    };

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
        setLoading(true);
    
        if (!placa || !marca || !tipo || !color || !nombre || !celular) {
          message.warning("Por favor completa los campos obligatorios.");
          setLoading(false);
          return;
        }
    
        if (placa.length !== 7) {
          message.warning("Por favor ingresa una placa válida");
          setLoading(false);
          return;
        }
    
        if (servicios.length === 0) {
          message.warning("Por favor selecciona al menos un servicio.");
          setLoading(false);
          return;
        }
    
        if (llaves.length === 0) {
          message.warning("Por favor selecciona si deja llaves o no");
          setLoading(false);
          return;
        }
    
        if (celular.length !== 10) {
          message.warning("Por favor ingresa un número de teléfono válido");
          setLoading(false);
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
            costo: servicio.costo,
            descuento: descuento
          })),
          costo: costoConDescuento,
          descuento: descuento
        };
        
          try {
             const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ordenes`
             const responseOrdenes = await fetch(apiUrl, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({ data: dataOrdens })
             });

             
             if (!responseOrdenes.ok) {
               console.error('Error en la petición:', responseOrdenes.statusText);
               setLoading(false);
              }

        
            // resetea el formulario si las solicitudes son exitosas
              setPlaca('');
              setMarca('');
              setTipo('');
              setColor('');
              setLlaves('');
              setObservaciones('');
              setNombre('');
              setCelular('');
              setCorreoCliente('');
              setServicios([]);
              setDescuento(0);
              setNombresServicios('');
    
            console.log('orden generada')
            console.log(dataOrdens)
            message.success('Orden generada')
            fetchOrdenesEnEspera();
            setIsSheetOpen(false);
            retrocederSeccion();
            retrocederSeccion();
            handleGenerarFactura();
            setLoading(false);
  
        } catch (error) {
          console.error('Error en la solicitud:', error);
          message.error('Error en la solicitud')
        }
    };

    // Función para manejar la generación de la factura
    const handleGenerarFactura = () => {
      const dataOrden: OrdenData = {
        nombre,
        celular,
        tipo,
        marca,
        color,
        placa,
        observaciones,
        servicios,
        descuento,
        costoConDescuento
      };

      generarFacturaPDF(dataOrden);
    };

  return (
    <>
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button className='h-9 text-[13px] gap-2 order-4 rounded-none'> Nueva orden <PlusIcon /> </Button>
    </SheetTrigger>
    <SheetContent
      style={{  maxWidth: '100vw'}} 
      className='max-md:w-svw overflow-y-auto tracking-tigh' >
        <SheetHeader>
        <SheetTitle>Crear nueva orden</SheetTitle>
        <SheetDescription className='m-auto'>
          <p className='text-transparent'>Hola</p>
        </SheetDescription>
        </SheetHeader>

        {seccion === 1 && (
                    <>
                    <Form onSubmitCapture={consultarOrden} className='max-md:w-full w-1/2 m-auto p-6 rounded-non bg-gray-100'>
                        <span className='font-semibold text-md'> Ingresar placa </span>
                        <article className='flex items-center gap-2 mt-2'>
                        <Input 
                            className='uppercase w-36 h-9 rounded-none' 
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
                            maxLength={7}
                            required 
                        />
                        <Button className='h-9 rounded-none'>
                        {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <Spin />
                        </span>
                    ) : (
                        'Verificar'
                    )}
                        </Button>
                        <Button onClick={handleRefresh} type='button' className='h-9 rounded-none' variant={'secondary'}>
                            Limpiar
                        </Button>
                        </article>
                    </Form>
                    </>
        )}

            <Form 
              id='orden' 
              onSubmitCapture={handleSubmit} 
              className='flex flex-col gap-10 font-geist text-xs' 
            >
                
                {seccion === 2 && (
                <>
                  <fieldset className='flex flex-wrap text-sm gap-x-5 gap-y-3 max-md:w-full'>
                      <legend className=''> Datos del vehiculo</legend>

                      <Label>
                        <span className='ml-1 text-zinc-500'>Placa
                        {/* <span className='text-red-500'>*</span> */}
                        </span>                       
                        <Input 
                          className='input uppercase h-9 w-[150px] my-2' 
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
                      </Label>

                      <Label>
                        <span className='ml-1 text-zinc-500'> Marca </span>
                        <Select
                            value={marca}
                            onValueChange={(value) => setMarca(value)}
                            >
                            <SelectTrigger className="w-[180px] h-9 my-2">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel> Selecciona </SelectLabel>
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
                              </SelectGroup>
                            </SelectContent>
                        </Select>
                      </Label>
                      

                      <Label>
                        <span className='ml-1 text-zinc-500'> Tipo </span>
                        <Select
                            value={tipo}
                            onValueChange={(value) => setTipo(value)}
                        >
                            <SelectTrigger className="w-[150px] h-9 my-2">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Automovil">Automovil</SelectItem>
                                <SelectItem value="Camioneta">Camioneta</SelectItem>
                            </SelectContent>
                        </Select>
                      </Label>

                      <Label>
                        <span className='ml-1 text-zinc-500'> Color </span>
                        <Select
                            value={color}
                            onValueChange={(value) => setColor(value)}
                        >
                            <SelectTrigger className="w-[180px] h-9 my-2">
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
                      </Label>

                      <Label>
                        <span className='ml-1 text-zinc-500'> Deja llaves? </span>
                        <Select
                            value={llaves}
                            onValueChange={(value) => setLlaves(value)}
                        >
                            <SelectTrigger className="w-[130px] h-9 my-2">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Si">Si</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                      </Label>

                      <Label>
                        <span className='ml-1 text-zinc-500'>Observaciones</span>
                        <Textarea className='my-2' rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)}/>
                      </Label>
                  </fieldset>

                  <fieldset className='flex text-sm flex-wrap gap-x-5 gap-y-3 max-md:w-full'>
                    <legend>Datos del cliente</legend>
                    <Label>
                      <span className='ml-1 text-zinc-500'>Nombre</span>
                      <Input className='capitalize max-md:w-40 h-9 my-2' 
                        type="text" value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required
                      />
                    </Label>

                    <Label>
                      <span className='ml-1 text-zinc-500'>Celular</span>
                      <Input 
                        className='max-md:w-40 h-9 my-2'
                        type="text" 
                        value={celular} 
                        onChange={(e) => {
                          const formattedValue = e.target.value.replace(/\D/g, '');
                          const trimmedValue = formattedValue.slice(0, 10);
                          setCelular(trimmedValue);
                        }} 
                        maxLength={10}             />
                    </Label>

                    <Label>
                        <span className='ml-1 text-zinc-500'>Correo</span>
                        <Input 
                          className='my-2 h-9'
                          type="email" 
                          value={correoCliente} 
                          onChange={(e) => setCorreoCliente(e.target.value)} 
                        />
                    </Label>

                  </fieldset>

                  <section className='flex max-w-min m-auto gap-3'>
                    <Button className='gap-2 rounded-none'
                      onClick={retrocederSeccion}
                      variant={'secondary'}
                      type='button'
                    >
                      <IoChevronBack />
                      Volver
                    </Button>
                    <Button
                      className='gap-2 rounded-none' 
                      onClick={avanzarSeccion}
                      type='button'
                    >
                      Siguiente
                      <GrFormNext className=' text-lg' />
                    </Button>
                  </section>
                </>
                )}

                {seccion === 3 &&(
                <>
                  <fieldset className='flex text-sm max-md:flex-col gap-2'>
                    <legend>Datos del Servicio</legend>
                      <section className='w-max gap-7 mt-0 rounded-md flex flex-col'>
                      <Label>
                        <span className='text-zinc-500'> Servicios </span>
                        <div className='flex items-center gap-4'>
                        <ServiciosSelect 
                            tipo={tipo} 
                            servicioSeleccionado={servicioSeleccionado} 
                            setServicioSeleccionado={setServicioSeleccionado} 
                        />
                        <Button 
                              className='rounded-none h-9 px-3'
                              title='Agregar'
                              type='button'
                              onClick={handleAgregarServicio}
                            >
                              <FaPlus />
                        </Button>
                        </div>
                      </Label>

                      <Label>
                          <span className='text-zinc-500'>
                            Aplicar descuento
                          </span>
                          <Input 
                            className='w-36 h-9 my-2 rounded-none'
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
                      </Label>

                      <Label>
                          <Input 
                            className='hidden' 
                            type="text" 
                            name='nombre_servicios' 
                            value={nombresServicios} 
                            readOnly 
                          />
                      </Label>
                    </section>
                
                    <section className="m-auto items-start flex flex-col w-2/5 max-md:w-full rounded p-2">
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

                        <Label className='ml-0 mt-5'>
                          <span className=' font-semibold'>
                            Subtotal
                          </span>
                          <Input 
                              className='bg-transparent border-none px-0' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoServicios.toLocaleString('es-CO')}`} 
                              readOnly 
                          />
                        </Label>

                        <Label className='ml-0'>
                          <span className=' font-semibold'>
                            Total
                          </span>
                          <Input 
                              className='bg-transparent border-none px-0' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoConDescuento.toLocaleString('es-CO')}`} 
                              readOnly 
                            />
                        </Label>
                    </section>
                  </fieldset>
                  <section className='flex max-w-min m-auto gap-3'>
                      <Button className='gap-2 rounded-none'
                        onClick={retrocederSeccion}
                        variant={'secondary'}
                        type='button'
                      >
                        <IoChevronBack />
                        Volver
                      </Button>
                        <Button className='rounded-none'>
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <Spin />
                            </span>
                        ) : (
                            'Generar orden'
                        )}
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