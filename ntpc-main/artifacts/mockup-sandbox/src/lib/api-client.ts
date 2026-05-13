// Mock API client - in a real app, this would be configured with actual API endpoints
// This simulates HTTP requests to the backend API

interface ApiResponse<T> {
  ok: boolean;
  json: () => Promise<T>;
}

export const api = {
  /**
   * GET request
   */
  get: async (url: string): Promise<ApiResponse<any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different endpoints
        if (url.includes('/ey-participants/')) {
          // Mock participant data
          resolve({
            ok: true,
            json: () => Promise.resolve({
              participant: {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                faydaId: "FYDA123456789",
                registrationNumber: "EY1234567890",
                email: "john.doe@example.com",
                phoneNumber: "+1234567890"
              },
              event: {
                id: 1,
                title: "National Youth Conference 2026"
              },
              round: {
                id: 1,
                roundNumber: 1
              }
            })
          });
        } else {
          // Default response
          resolve({
            ok: true,
            json: () => Promise.resolve({ message: "Success" })
          });
        }
      }, 500);
    });
  },

  /**
   * POST request
   */
  post: async (url: string, data: any = {}): Promise<ApiResponse<any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Handle badge generation endpoint
        if (url.includes('/generate-badge')) {
          // Return HTML for the badge (this matches what the backend actually returns)
          resolve({
            ok: true,
            json: () => Promise.resolve(`
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>Event Badge</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; padding: 20px; }
                  
                  .badge-page {
                    page-break-after: always;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 11in;
                    padding: 20px;
                  }
                  
                  .badge {
                    width: 4in;
                    height: 5.5in;
                    background: linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%);
                    border-radius: 15px;
                    padding: 25px;
                    color: white;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                  }
                  
                  .badge::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #f39c12, #e67e22, #f1c40f);
                  }
                  
                  .badge-header {
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                  }
                  .badge-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                  }
                  .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  }
                  .logo-mark {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  }
                  .logo-text {
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.95);
                    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                  }
                  .badge-header h2 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #ecf0f1;
                  }
                  
                  .event-name {
                    font-size: 16px;
                    font-weight: 500;
                    color: #fdcb6e;
                    background: rgba(255,255,255,0.1);
                    padding: 4px 12px;
                    border-radius: 20px;
                    display: inline-block;
                  }
                  
                  .badge-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 10px 0;
                  }
                  
                  .participant-name {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 18px;
                    text-align: center;
                    letter-spacing: 0.5px;
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
                  }
                  
                  .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    font-size: 13px;
                  }
                  
                  .label {
                    font-weight: 600;
                    color: #bdc3c7;
                    min-width: 70px;
                  }
                  
                  .value {
                    font-weight: 500;
                    color: #ecf0f1;
                    text-align: right;
                    flex: 1;
                  }
                  
                  .badge-footer {
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    padding-top: 15px;
                  }
                  
                  .barcode-container {
                    background: rgba(0,0,0,0.3);
                    padding: 8px;
                    border-radius: 8px;
                    display: inline-block;
                    margin-bottom: 10px;
                  }
                  
                  .barcode {
                    font-family: 'Courier New', monospace;
                    font-size: 16px;
                    letter-spacing: 3px;
                    background: white;
                    color: #2c3e50;
                    padding: 4px 8px;
                    border-radius: 4px;
                    display: inline-block;
                    font-weight: bold;
                  }
                  
                  .footer-text {
                    font-size: 11px;
                    color: #bdc3c7;
                    font-style: italic;
                  }
                  
                  /* Security watermark */
                  .badge::after {
                    content: "NTPC";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    font-size: 80px;
                    color: rgba(255,255,255,0.05);
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: translate(-50%, -50%) rotate(15deg);
                    pointer-events: none;
                    z-index: 1;
                  }
                  
                  @media print {
                    body { margin: 0; padding: 0; background: white; }
                    .badge-page { min-height: auto; page-break-after: always; }
                    .badge { box-shadow: none; }
                  }
                </style>
              </head>
              <body>
                <div class="badge-page">
                  <div class="badge">
                    <div class="badge-header">
                      <div class="badge-logo">
                        <div class="logo-container">
                          <div class="logo-mark">⛪</div>
                          <div class="logo-text">NTPC Church</div>
                        </div>
                      </div>
                      <h2>NTPC Event Badge</h2>
                      <p class="event-name">National Youth Conference 2026</p>
                    </div>
                    
                    <div class="badge-body">
                      <div class="participant-name">John Doe</div>
                      <div class="info-row">
                        <span class="label">Fayda ID:</span>
                        <span class="value">FYDA123456789</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Reg #:</span>
                        <span class="value">EY1234567890</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Round:</span>
                        <span class="value">1</span>
                      </div>
                    </div>
                    
                    <div class="badge-footer">
                      <div class="barcode-container">
                        <div class="barcode">EY1234567890</div>
                      </div>
                      <p class="footer-text">Please wear this badge throughout the event</p>
                    </div>
                  </div>
                </div>
              </body>
              </html>
            `)
          });
        } else {
          // Default POST response
          resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: data })
          });
        }
      }, 500);
    });
  },

  /**
   * PUT request
   */
  put: async (url: string, data: any = {}): Promise<ApiResponse<any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: data })
        });
      }, 500);
    });
  },

  /**
   * DELETE request
   */
  delete: async (url: string): Promise<ApiResponse<any>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      }, 500);
    });
  }
};