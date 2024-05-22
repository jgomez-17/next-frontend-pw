import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message } from 'antd';
import { IoChevronBackSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import Modal from '@/app/components/ui/modal2/butonmodal'
import './drawer.css'

//TEXT AREA
const { TextArea } = Input;
//SELECT
const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  interface DrawerformProps {
    onOrderCreated: () => void;
    showButton?: boolean;
  }
  // const Drawerform: React.FC<DrawerformProps> = ({ onOrderCreated, showButton = true }) => {
  const Drawerform: React.FC<DrawerformProps> = ({ onOrderCreated, showButton = true  }) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // FORMULARIO
  // SECCIONES
  const [seccion, setSeccion] = useState<number>(1); // Estado para controlar qué sección se muestra

  const avanzarSeccion = () => {
    if (seccion === 1 && !tipo) {
      message.warning("Por favor selecciona un tipo de vehículo.");
      return;
    }
    setSeccion(seccion + 1);
  };

  const retrocederSeccion = () => {
    setSeccion(seccion - 1);
  };

  // Estado para los datos del vehiculo
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [tipo, setTipo] = useState('');
  const [color, setColor] = useState('');
  const [llaves, setLlaves] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estado para los datos del cliente
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');

  // Estado para los datos del servicio
  const [servicios, setServicios] = useState<{ nombre: string, costo: number}[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>('');
  const [nombresServicios, setNombresServicios] = useState<string>(''); 
  const [descuento, setDescuento] = useState<number>(0); // Nuevo estado para el descuento

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
  }, [tipo]);
  

  const costoServicios: number = servicios.reduce((total, servicio) => {
    return total + servicio.costo;
  }, 0);

  const costoConDescuento: number = costoServicios - descuento; // Calcula el costo con el descuento

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
    const nuevosNombres = serviciosFiltrados.map(servicio => servicio.nombre).join(',');
    setNombresServicios(nuevosNombres);
  };

  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

      // Validar que los campos obligatorios estén llenos
  if (!placa || !marca || !tipo || !color || !nombre || !celular) {
    message.warning("Por favor completa los campos obligatorios.");
    return;
  }

    // Validar que la placa sea valida
    if (placa.length !== 7) {
      message.warning("Por favor ingresa una placa válida");
      return;
    }

  // Validar si al menos un servicio está seleccionado
  if (servicios.length === 0) {
    message.warning("Por favor selecciona al menos un servicio.");
    return;
  }

  if (llaves.length === 0) {
    message.warning("Por favor selecciona si deja llaves o no");
    return;
  }

    // Validar que el número de teléfono tenga exactamente 10 dígitos
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
         const responseOrdenes = await fetch('http://localhost:4000/api/ordenes', {
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
        onOrderCreated();
        onClose();
        

    } catch (error) {
      console.error('Error en la solicitud:', error);
      message.error('Error en la solicitud')
    }
  };

  return (
    <>
      {showButton && (
        <Button className='float-end' type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          Nueva orden
        </Button>
      )}
      <Drawer
        title="Crear nueva orden"
        width={1260}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space >
            <Modal />
          </Space>
        }
      >
        <form id='orden' onSubmit={handleSubmit} className='flex flex-col gap-4 items-center'>
              {seccion === 1 && (
                <>
                  <fieldset className='datos-vehiculo w-9/12 max-md:w-full'>
                    <legend>Datos del Vehículo</legend>
                    <label>
                      <span>Placa
                      {/* <span className='text-red-500'>*</span> */}
                      </span>
                      
                      <Input 
                        className='input uppercase w-28' 
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
                      <span>Marca</span>
                      <Select
                        className='selectform w-32'
                        showSearch
                        placeholder='$'
                        optionFilterProp="children"
                        onChange={(value) => setMarca(value)}
                        value={marca}
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={[
                          {
                            value: 'Audi',
                            label: 'Audi',
                          },
                          {
                            value: 'BMW',
                            label: 'BMW',
                          },
                          {
                            value: 'Cadillac',
                            label: 'Cadillac',
                          },
                          {
                            value: 'Citroen',
                            label: 'Citroen',
                          },
                          {
                            value: 'Chery',
                            label: 'Chery',
                          },
                          {
                            value: 'Chevrolet',
                            label: 'Chevrolet',
                          },
                          {
                            value: 'Dodge',
                            label: 'Dodge',
                          },
                          {
                            value: 'Fiat',
                            label: 'Fiat',
                          },
                          {
                            value: 'Ford',
                            label: 'Ford',
                          },
                          {
                            value: 'Honda',
                            label: 'Honda',
                          },
                          {
                            value: 'Hyundai',
                            label: 'Hyundai',
                          },
                          {
                            value: 'Jeep',
                            label: 'Jeep',
                          },
                          {
                            value: 'Jaguar',
                            label: 'Jaguar',
                          },
                          {
                            value: 'Kia',
                            label: 'Kia',
                          },
                          {
                            value: 'Land Rover',
                            label: 'Land Rover',
                          },
                          {
                            value: 'Lexus',
                            label: 'Lexus',
                          },
                          {
                            value: 'Mazda',
                            label: 'Mazda',
                          },
                          {
                            value: 'Mercedes',
                            label: 'Mercedes',
                          },
                          {
                            value: 'Mitsubishi',
                            label: 'Mitsubishi',
                          },
                          {
                            value: 'Mini Cooper',
                            label: 'Mini Cooper',
                          },
                          {
                            value: 'Nissan',
                            label: 'Nissan',
                          },
                          {
                            value: 'Toyota',
                            label: 'Toyota',
                          },
                          {
                            value: 'Volkswagen',
                            label: 'Volkswagen',
                          },
                          {
                            value: 'Peugeot',
                            label: 'Peugeot',
                          },
                          {
                            value: 'Porsche',
                            label: 'Porsche',
                          },
                          {
                            value: 'Renault',
                            label: 'Renault',
                          },
                          {
                            value: 'Rolls Royce',
                            label: 'Rolls Royce',
                          },
                          {
                            value: 'Subaru',
                            label: 'Subaru',
                          },
                          {
                            value: 'Suzuki',
                            label: 'Suzuki',
                          },
                          {
                            value: 'Volvo',
                            label: 'Volvo',
                          },
                          {
                            value: 'Otro',
                            label: 'Otro',
                          },
                        ]}
                      />
                    </label>
                    <label>
                      <span>Tipo</span>
                      <Select
                        className='selectform w-28'
                        aria-required
                        showSearch
                        placeholder='$'
                        optionFilterProp="children"
                        onChange={(value) => setTipo(value)}
                        value={tipo}
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={[
                          {
                            value: 'Automovil',
                            label: 'Automovil',
                          },
                          {
                            value: 'Camioneta',
                            label: 'Camioneta',
                          }
                        ]}
                      />
                    </label>

                    <label>
                      <span>Color</span>
                      <Select
                        className='selectform w-28'
                        aria-required
                        showSearch
                        placeholder="Select a color"
                        optionFilterProp="children"
                        onChange={(value) => setColor(value)}
                        value={color}
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={[
                          {
                            value: 'Negro',
                            label: 'Negro',
                          },
                          {
                            value: 'Blanco',
                            label: 'Blanco',
                          },
                          {
                            value: 'Azul',
                            label: 'Azul',
                          },
                          {
                            value: 'Amarillo',
                            label: 'Amarillo',
                          },
                          {
                            value: 'Beige',
                            label: 'Beige',
                          },
                          {
                            value: 'Gris',
                            label: 'Gris',
                          },
                          {
                            value: 'Morado',
                            label: 'Morado',
                          },
                          {
                            value: 'Plateado',
                            label: 'Plateado',
                          },
                          {
                            value: 'Rojo',
                            label: 'Rojo',
                          },
                          {
                            value: 'Vinotinto',
                            label: 'Vinotinto',
                          },
                          {
                            value: 'Verde',
                            label: 'Verde',
                          },
                        ]}
                      />
                    </label>

                    <label>
                      <span>Deja llaves?</span>
                      <Select
                        className='selectform w-22'
                        aria-required
                        showSearch
                        placeholder='$'
                        optionFilterProp="children"
                        onChange={(value) => setLlaves(value)}
                        value={llaves}
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={[
                          {
                            value: 'Si',
                            label: 'Si',
                          },
                          {
                            value: 'No',
                            label: 'No',
                          }                          
                        ]}
                      />
                    </label>

                    <label>
                    <span>Observaciones</span>
                      <TextArea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)}/>
                    </label>
                </fieldset>

                <fieldset className='w-9/12 max-md:w-full'>
                  <legend>Datos del cliente</legend>
                  <label>
                    <span>Nombre</span>
                    <Input className='input capitalize max-md:w-40 ' 
                      type="text" value={nombre} 
                      onChange={(e) => setNombre(e.target.value)} 
                      required
                    />
                  </label>
                  <label>
                    <span>Celular</span>
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
                  <label>
                      <span>Correo</span>
                      <Input 
                        className='input'
                        type="email" 
                        value={correoCliente} 
                        onChange={(e) => setCorreoCliente(e.target.value)} 
                      />
                  </label>
                </fieldset>
                  <article className='flex max-w-min m-auto gap-4'>
                    <button
                      className='flex rounded gap-4 p-2 px-3 justify-center items-center bg-black text-white hover:bg-sky-700 ' 
                      type="button" 
                      onClick={avanzarSeccion}>
                      Siguiente
                      <GrNext />
                    </button>
                  </article>
                </>
              )}
              
              {seccion === 2 &&(
                <>
                  <fieldset className='flex max-md:flex-col gap-2'>
                    <legend>Datos del Servicio</legend>
                      <section className='w-max m-auto mt-0 rounded-md flex flex-col md:bg-slate-50'>
                      <label>
                      <span>Escoge tus servicios</span>
                        <article className='flex w-max flex-row items-center gap-3'>
                            <Select
                              className='selectform w-[21rem]'
                              showSearch  
                              placeholder='Seleccionar'
                              onChange={(value) => setServicioSeleccionado(value)}
                              value={servicioSeleccionado}
                              filterOption={filterOption} 
                            >
                              {Object.entries(preciosServicios).map(([nombreServicio, costo]) => (
                                <Select.Option key={nombreServicio} value={`${nombreServicio} - $${costo}`}>
                                  {nombreServicio} - ${costo.toLocaleString('es-CO')}
                                </Select.Option>
                              ))}
                            </Select>
                            <Button 
                              className=' bg-white border-slate-200 rounded-lg border' 
                              type="text" 
                              title='Agregar'
                              onClick={handleAgregarServicio}
                            >
                              <FaPlus />
                            </Button>
                        </article>
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
                            className='nombre_servicios' 
                            type="text" 
                            name='nombre_servicios' 
                            value={nombresServicios} 
                            readOnly 
                            hidden 
                          />
                      </label>
                    </section>
                
                    <section className="md:bg-slate-50 m-auto items-start flex flex-col w-2/5 max-md:w-full rounded p-2">
                      <span className='font-semibold my-3'>
                        Detalles de la orden
                      </span>
                          {servicios.map(servicio => (
                              <section 
                                title='seleccione para eliminar servicio' 
                                key={servicio.nombre} 
                                className="servicio py-1 transition cursor-pointer hover:text-red-500 text-gray-600" 
                                onClick={() => handleRemoveServicio(servicio.nombre)}>
                                {servicio.nombre}
                              </section>
                            ))}

                        <label className='ml-0 mt-5'>
                          <span className=''>
                            Total
                          </span>
                          <Input 
                              className='costo-servicios' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoServicios.toLocaleString('es-CO')}`} 
                              readOnly 
                          />
                        </label>

                        <label className='ml-0'>
                          <span>
                            Total con descuento
                          </span>
                          <Input 
                              className='costo-con-descuentos' 
                              type="text" 
                              name="costo" 
                              value={`$ ${costoConDescuento.toLocaleString('es-CO')}`} 
                              readOnly 
                            />
                        </label>
                    </section>
              </fieldset>
                    <section className='flex max-w-min m-auto gap-3'>
                      <button 
                          className=' w-24 rounded justify-center flex items-center bg-black text-white hover:bg-sky-700 gap-4' 
                          type="button" 
                          onClick={retrocederSeccion}
                          >
                        <IoChevronBackSharp />
                        Atras
                      </button>
                        <button 
                            className='flex p-2 w-32 items-center justify-center rounded bg-black text-white hover:bg-sky-700' 
                            type="submit"
                            >
                            Generar orden
                        </button>
                    </section>
                </>
              )}
            </form>
      </Drawer>
    </>
  );
};

export default Drawerform;