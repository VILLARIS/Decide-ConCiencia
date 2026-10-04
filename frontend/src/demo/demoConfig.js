/*
  Configuracion del modo demostracion.

  MODO DEMO
  ----------
  Todo el producto es un prototipo: no hay backend, pasarela de pago ni
  autenticacion real. Estas banderas concentran lo que SOLO debe existir
  mientras sea una demo, para que apagar la demo sea cambiar booleans y no
  reescribir componentes.

  Cuando exista la pasarela real:
  1. DEMO_MODE = false  -> desaparecen los controles "Simular pago ...".
  2. El pago deja de resolverse en el navegador y pasa a esperar la
     confirmacion del backend (webhook). Ver src/demo/DemoPurchaseProvider.jsx.
*/

export const DEMO_MODE = true

/*
  Nunca se guardan datos de tarjeta: ni numero completo, ni CVV, ni credenciales
  de pago. En la version real, esos datos los captura la pasarela en su propio
  formulario alojado y solo vuelve un identificador de operacion.
*/
export const PAYMENT_METHODS = [
  {
    id: 'online',
    label: 'Pago online',
    description: 'Tarjeta o método disponible según la pasarela seleccionada.',
  },
]