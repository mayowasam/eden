export const formatPhoneNumber = (value: string) => {

  let formattedValue = value;
  if (value?.startsWith('0')) {
    formattedValue = '+234' + value?.slice(1);
  } else if (!value?.startsWith('234')) {
    formattedValue = '+234' + value;
  }
  return formattedValue;
};

export const changeCurrency = (amount: number) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'NGN',
    style: 'decimal',
    minimumFractionDigits: 2,
  }).format(amount || 0);

  return `₦${formattedAmount}`

}

export const copyClipboard = async (content: string) => {
  await window.navigator.clipboard.writeText(content);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function downloadCsv(data: any, fileName?: string) {
  const blob = new Blob([data], { type: "text/csv" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", fileName ? `${fileName}.csv` : "payment_history.csv");
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportCsv = (data: any[], headers: string[], fields: string[]) => {
  // Create CSV rows based on the fields
  const usersCsv = data.map((item) => {
    // Map over the specified fields and get the corresponding values from the item
    return fields.map(field => getNestedValue(item, field)).join(',');
  });

  const csvData = [headers.join(','), ...usersCsv].join("\n");

  downloadCsv(csvData);
}

export const printInvoice = (data: {
  name: string,
  items: (Product & { total: number })[],
  total: number
}) => {
  // Create a new window to print
  const printWindow = window.open('', '', 'width=800,height=600');
  const htmlContent = `
        <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            .invoice-table th {
              background-color: #f2f2f2;
              text-align: left;
            }
            .invoice-total {
              margin-top: 20px;
            }
            .no-print {
              display: none;
            }
          </style>
        </head>
        <body>
          <div class="invoice-content">
            <h2>Invoice</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${data.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="invoice-total">
              <p><strong>Total: ${data.total}</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;
  if (printWindow) {
      // Write the HTML content to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Trigger print after the content is loaded
      printWindow.focus();
      printWindow.print();

      // Close the print window after printing
      printWindow.onafterprint = () => {
          printWindow.close();
      };
  }
};