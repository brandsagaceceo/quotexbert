import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import puppeteer from "puppeteer";

// Types for contract data
interface ContractDTO {
  id: string;
  title: string;
  description: string;
  scope: string;
  totalAmountCents: number;
  homeowner: {
    email: string;
    id: string;
  };
  contractor: {
    email: string;
    id: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: Date;
  acceptedAt?: Date;
}

// Initialize S3 client
function getS3Client(): S3Client | null {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.warn("S3 configuration incomplete. PDF upload will be disabled.");
    return null;
  }

  return new S3Client({
    endpoint,
    region: "auto",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

// Generate SHA256 hash of contract data for integrity verification
export function hashContract(contract: ContractDTO): string {
  const contractData = {
    id: contract.id,
    title: contract.title,
    description: contract.description,
    scope: contract.scope,
    totalAmountCents: contract.totalAmountCents,
    homeownerId: contract.homeowner.id,
    contractorId: contract.contractor.id,
    items: contract.items,
    createdAt: contract.createdAt.toISOString(),
    acceptedAt: contract.acceptedAt?.toISOString(),
  };

  const hash = createHash("sha256");
  hash.update(JSON.stringify(contractData));
  return hash.digest("hex");
}

// Render contract HTML for PDF generation
export function renderContractPdfHtml(contract: ContractDTO): string {
  const formattedTotal = (contract.totalAmountCents / 100).toFixed(2);
  const contractHash = hashContract(contract);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contract - ${contract.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1f2937;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .contract-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .party {
            border: 1px solid #e5e7eb;
            padding: 20px;
            border-radius: 6px;
          }
          .party h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
          }
          .items-table th {
            background: #f9fafb;
            font-weight: bold;
          }
          .items-table .amount {
            text-align: right;
          }
          .total-row {
            font-weight: bold;
            background: #f9fafb;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin: 40px 0;
          }
          .signature-line {
            border-bottom: 2px solid #000;
            height: 50px;
            margin-bottom: 10px;
          }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Quotexbert</div>
          <h1>Service Contract</h1>
          <p>Contract ID: ${contract.id}</p>
        </div>

        <div class="contract-info">
          <div class="party">
            <h3>Homeowner</h3>
            <p><strong>Email:</strong> ${contract.homeowner.email}</p>
            <p><strong>ID:</strong> ${contract.homeowner.id}</p>
          </div>
          <div class="party">
            <h3>Contractor</h3>
            <p><strong>Email:</strong> ${contract.contractor.email}</p>
            <p><strong>ID:</strong> ${contract.contractor.id}</p>
          </div>
        </div>

        <div class="section">
          <h2>Contract Details</h2>
          <p><strong>Title:</strong> ${contract.title}</p>
          <p><strong>Description:</strong> ${contract.description}</p>
        </div>

        <div class="section">
          <h2>Scope of Work</h2>
          <p>${contract.scope}</p>
        </div>

        <div class="section">
          <h2>Line Items</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${contract.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td class="amount">$${(item.unitPrice / 100).toFixed(2)}</td>
                  <td class="amount">$${(item.totalPrice / 100).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3"><strong>Total Amount</strong></td>
                <td class="amount"><strong>$${formattedTotal}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Important Dates</h2>
          <p><strong>Created:</strong> ${contract.createdAt.toLocaleDateString()}</p>
          ${contract.acceptedAt ? `<p><strong>Accepted:</strong> ${contract.acceptedAt.toLocaleDateString()}</p>` : ''}
        </div>

        <div class="signatures">
          <div>
            <h3>Homeowner Signature</h3>
            <div class="signature-line"></div>
            <p>Date: _______________</p>
          </div>
          <div>
            <h3>Contractor Signature</h3>
            <div class="signature-line"></div>
            <p>Date: _______________</p>
          </div>
        </div>

        <div class="footer">
          <p>This contract was generated by Quotexbert on ${new Date().toLocaleDateString()}.</p>
          <p><strong>Contract Hash (SHA256):</strong> ${contractHash}</p>
          <p>This hash can be used to verify the integrity of the contract data.</p>
        </div>
      </body>
    </html>
  `;
}

// Convert HTML to PDF using Puppeteer
export async function htmlToPdf(html: string): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Upload PDF to S3 and return public URL
export async function uploadPdf(buffer: Buffer, key: string): Promise<string> {
  const s3Client = getS3Client();
  const bucket = process.env.S3_BUCKET;

  if (!s3Client || !bucket) {
    throw new Error("S3 configuration incomplete");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
    ContentDisposition: `attachment; filename="${key}"`,
  });

  await s3Client.send(command);

  // Return the public URL (adjust based on your S3 setup)
  const endpoint = process.env.S3_ENDPOINT;
  return `${endpoint}/${bucket}/${key}`;
}

// Generate and upload contract PDF
export async function generateContractPdf(contract: ContractDTO): Promise<string> {
  try {
    // Render HTML
    const html = renderContractPdfHtml(contract);
    
    // Convert to PDF
    const pdfBuffer = await htmlToPdf(html);
    
    // Generate unique key
    const timestamp = new Date().toISOString().split('T')[0];
    const key = `contracts/${contract.id}/contract-${timestamp}.pdf`;
    
    // Upload to S3
    const pdfUrl = await uploadPdf(pdfBuffer, key);
    
    return pdfUrl;
  } catch (error) {
    console.error("Failed to generate contract PDF:", error);
    throw error;
  }
}
