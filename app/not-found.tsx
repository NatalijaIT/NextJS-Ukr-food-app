import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Not Found',
    description: 'The requested page could not be found.',
};

export default function NotFound() {
    return (
        <main className="not-found">
            <h1>Not Found</h1>
            <p>Unfortunately, we couldn&apos;t find the requested resourse.</p>
        </main>
    )
}