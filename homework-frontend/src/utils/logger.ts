class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatUrl(url: string, method: string): string {
    return `${method.toUpperCase()} ${url}`;
  }

  private getResponseHeaders(response: Response): Record<string, string> {
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  logRequest(url: string, method: string, body?: any, headers?: any) {
    console.group(
      `[${this.formatTimestamp()}] Request: ${this.formatUrl(url, method)}`
    );

    if (headers) {
      console.log('Headers: ', headers);
    }

    if (body) {
      console.log('Body: ', body);
    }

    console.groupEnd();
  }

  logResponse(url: string, method: string, response: Response, data?: any) {
    const status = response.status;
    const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';

    console.group(
      `${statusIcon} [${this.formatTimestamp()}] Response: ${this.formatUrl(url, method)}`
    );

    console.log('Status: ', status, response.statusText);

    console.log('Headers: ', this.getResponseHeaders(response));

    if (data) {
      console.log('Data: ', data);
    }

    console.groupEnd();
  }

  logError(url: string, method: string, error: Error) {
    console.group(
      `[${this.formatTimestamp()}] Error: ${this.formatUrl(url, method)}`
    );
    console.log('Error: ', error.message);
    console.groupEnd();
  }
}

export const logger = new Logger();
