import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "../src/auth/AuthContext";
import ErrorBoundary from "../src/utils/ErrorBoundary";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <AuthContextProvider>
                <Component {...pageProps} />
            </AuthContextProvider>
        </ErrorBoundary>
    );
}

export default MyApp;
