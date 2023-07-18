import React from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import AppContextProvider from './context/AppContext';
import CourseContextProvider from './context/CourseContext';
import './index.css';
import * as swRegistration from './serviceWorkerRegistration';

/**
 * Sentry.init: This is a method provided by the Sentry SDK that initializes the Sentry client with the specified configuration options.
 * dsn: process.env.REACT_APP_SENTRY_INGEST_CLIENT: The dsn (Data Source Name) is a unique identifier provided by Sentry to link the client application to the Sentry project. The process.env.REACT_APP_SENTRY_INGEST_CLIENT represents an environment variable that holds the DSN value. Environment variables are used to store configuration values outside the codebase, allowing different configurations for different environments (e.g., development, production).
 * integrations: [new BrowserTracing()]: This line adds the BrowserTracing integration to Sentry. Integrations are additional functionalities that extend the capabilities of Sentry. In this case, BrowserTracing is used for tracing performance data in the browser, such as measuring frontend performance and monitoring transaction durations.
 * tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACE_RATE_CLIENT): The tracesSampleRate determines the percentage of transactions or performance traces that are sent to Sentry for analysis. The value of tracesSampleRate is obtained from the process.env.REACT_APP_SENTRY_TRACE_RATE_CLIENT environment variable, converted to a number using Number(). This variable is likely set to control the sampling rate based on the environment, so as not to overload the Sentry server with too much data in high-traffic scenarios.
 */
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_INGEST_CLIENT,
  integrations: [new BrowserTracing()],
  tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACE_RATE_CLIENT),
});

const Root: React.FC = () => (
  <AppContextProvider>
    <CourseContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />} path="/" />
        </Routes>
      </BrowserRouter>
    </CourseContextProvider>
  </AppContextProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(<Root />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
swRegistration.unregister();
