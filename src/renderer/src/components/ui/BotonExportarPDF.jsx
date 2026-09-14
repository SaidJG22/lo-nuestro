import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { useToast } from './ToastProvider'

export default function BotonExportarPDF({
  producto,
  printClass = 'modo-impresion',
  fileName,
  label = 'Guardar Ticket en PDF',
  validar
}) {
  const showToast = useToast()
  const [exportando, setExportando] = useState(false)

  const handleExportar = async () => {
    if (validar) {
      if (!validar()) return
    } else if (typeof producto !== 'undefined' && !producto) {
      return showToast('Cargá primero el nombre del producto.', 'error')
    }

    setExportando(true)
    document.body.classList.add(printClass)
    await new Promise((resolve) => requestAnimationFrame(resolve))

    try {
      const resultado = await window.api.exportarPDF(fileName ? fileName() : undefined)
      if (resultado.ok) showToast('PDF exportado.', 'success')
    } finally {
      document.body.classList.remove(printClass)
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
      <FileDown size={16} /> {exportando ? 'Generando...' : label}
    </button>
  )
}
