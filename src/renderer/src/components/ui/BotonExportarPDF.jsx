import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useToast } from './ToastProvider'

export default function BotonExportarPDF({ producto }) {
  const showToast = useToast()
  const [exportando, setExportando] = useState(false)

  const handleExportar = async () => {
    if (!producto) return showToast('Cargá primero el nombre del producto.', 'error')

    setExportando(true)
    document.body.classList.add('modo-impresion')
    await new Promise((resolve) => requestAnimationFrame(resolve))

    try {
      const resultado = await window.api.exportarTicketPDF()
      if (resultado.ok) showToast('Ticket exportado a PDF.', 'success')
    } finally {
      document.body.classList.remove('modo-impresion')
      setExportando(false)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline-info w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
      onClick={handleExportar}
      disabled={exportando}
    >
      <FileDown size={16} /> {exportando ? 'Generando...' : 'Guardar Ticket en PDF'}
    </button>
  )
}
