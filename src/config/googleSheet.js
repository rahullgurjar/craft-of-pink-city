/**
 * Google Sheets Web App Endpoint Configuration
 * 
 * Connected to live Google Apps Script endpoint
 */

export const GOOGLE_SHEET_WEB_APP_URL =
  import.meta.env.VITE_GOOGLE_SHEET_URL ||
  'https://script.google.com/macros/s/AKfycbz0ziPxSrdZFX9QL9ERKVR59xkKYT1ALlAFMVoHECWRKnx-s62qpcCG0vT3rNiaZdya/exec';

/**
 * Submits form / checkout order data to the Google Sheets Web App endpoint
 * @param {Object} formData Form data object
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitToGoogleSheet(formData) {
  const url = GOOGLE_SHEET_WEB_APP_URL.trim();

  if (!url) {
    console.warn(
      'Google Sheet Web App URL is not set. Please set VITE_GOOGLE_SHEET_URL in .env or src/config/googleSheet.js'
    );
    return {
      success: true,
      unconfigured: true,
      message: 'Sheet URL not configured.',
    };
  }

  try {
    let productsString = '';
    if (Array.isArray(formData.items)) {
      productsString = formData.items
        .map((it) => `${it.name} (Qty: ${it.quantity || 1}${it.price ? ` - ${it.price}` : ''})`)
        .join('; ');
    } else if (Array.isArray(formData.selectedProducts)) {
      productsString = formData.selectedProducts.join(', ');
    } else {
      productsString = formData.products || '';
    }

    let customNotes = formData.notes || '';
    if (formData.address) {
      customNotes = customNotes
        ? `Delivery Address: ${formData.address}\nNotes: ${customNotes}`
        : `Delivery Address: ${formData.address}`;
    }
    if (formData.totalAmount) {
      customNotes = `Total Amount: ${formData.totalAmount}\n${customNotes}`;
    }

    const payload = {
      timestamp:
        formData.timestamp ||
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: formData.name || '',
      company: formData.company || 'Direct Online Customer',
      phone: formData.phone || '',
      email: formData.email || '',
      products: productsString,
      quantity: formData.quantity || `${(formData.items && formData.items.length) || 1} item(s)`,
      timeline: formData.timeline || 'Immediate Dispatch',
      notes: customNotes,
      source: formData.source || 'Website Order Form',
    };

    // Google Apps Script endpoint submission with text/plain
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Order details successfully saved to Google Sheet!',
    };
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit to Google Sheet',
    };
  }
}
