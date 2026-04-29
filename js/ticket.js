// ══════════════════════════════════════
//  Sara's Birthday — ticket.js
//  Golden Ticket PDF generation
//  Uses html2canvas + jsPDF (CDN loaded on demand)
// ══════════════════════════════════════

(function () {
  const downloadBtn = document.getElementById('download-ticket');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', generateTicketPDF);

  async function generateTicketPDF() {
    downloadBtn.textContent = 'Preparing ticket...';
    downloadBtn.disabled = true;

    try {
      // Dynamically load html2canvas and jsPDF if not already loaded
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

      // Make ticket visible off-screen for rendering
      const templateWrapper = document.getElementById('ticket-template');
      const ticketEl = document.getElementById('ticket-render');

      // Temporarily make it visible for canvas capture
      templateWrapper.style.display = 'block';
      templateWrapper.style.position = 'fixed';
      templateWrapper.style.left = '-9999px';
      templateWrapper.style.top = '0';
      templateWrapper.style.zIndex = '-1';

      await new Promise(r => setTimeout(r, 100)); // let fonts render

      const canvas = await html2canvas(ticketEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffbf0',
        logging: false,
      });

      templateWrapper.style.display = 'none';

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('sara-golden-ticket.pdf');

      downloadBtn.textContent = 'Downloaded! ✨';
      downloadBtn.disabled = false;

    } catch (err) {
      console.error('Ticket generation failed:', err);
      downloadBtn.textContent = 'Try again ✨';
      downloadBtn.disabled = false;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
})();
